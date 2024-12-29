<script lang="ts">
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { Scene } from '$lib/webGPU/Scene';
	import { SceneObject } from '$lib/webGPU/SceneObject';
	import { onMount } from 'svelte';
	import { ArcballControls2 } from '$lib/webGPU/controls/ArcballControls2';
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';
	import { QuadGeometry } from '$lib/webGPU/geometry/QuadGeometry';
	import { RayMarchingMaterial } from '$lib/webGPU/material/RayMarchingMaterial';
	import { getSettings } from '$lib/settings.svelte';
	import { mat4, vec3 } from 'wgpu-matrix';
	import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { compute3DTexture } from '$lib/computeShader';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { loadPDBLocal } from '$lib/mol/pdbLoader';
	import { createPdbGeometry } from '$lib/mol/pdbGeometry';

	let canvas = $state<HTMLCanvasElement>();

	const settings = getSettings();

	const colorControl = settings.addControl({
		name: 'Clear color',
		type: 'select',
		value: 'white',
		options: [
			{ label: 'White', value: 'white' },
			{ label: 'Red', value: 'red' },
			{ label: 'Green', value: 'green' },
			{ label: 'Blue', value: 'blue' },
		],
	});

	onMount(async () => {
		try {
			if (!canvas) return;

			const context = canvas.getContext('webgpu');
			if (!context) return;

			const camera = new Camera();
			camera.setPosition(vec3.create(0, 0, -8));

			// const controls = new ArcballControls2({ eventSource: canvas, camera, distance: -16 });

			console.time('Compute');

			const { device } = await initWebGPU({
				deviceOptions: (adapter) => ({
					requiredLimits: { maxBufferSize: adapter.limits.maxBufferSize },
				}),
			});

			const colorMaterial = new ColorMaterial('white');
			const geometry = new SphereGeometry();

			const atom1 = new SceneObject(geometry, colorMaterial);
			atom1.setPosition(vec3.create(7.5, 7.5, 7.5));

			const atom2 = new SceneObject(geometry, colorMaterial);
			atom2.setPosition(vec3.create(11, 7.5, 7.5));

			const atom3 = new SceneObject(geometry, colorMaterial);
			atom3.setPosition(vec3.create(15, 0, 8));

			const atom4 = new SceneObject(geometry, colorMaterial);
			atom4.setPosition(vec3.create(0, 15, 8));

			const atom5 = new SceneObject(geometry, colorMaterial);
			atom5.setPosition(vec3.create(15, 15, 8));

			const atoms = [atom1, atom2]; //, atom2, atom3, atom4, atom5];

			const PDB = await loadPDBLocal('example');
			if (!PDB) return;
			const atoms_2 = createPdbGeometry(PDB);

			let dimensions = {
				width: { min: 0, max: 0 },
				height: { min: 0, max: 0 },
				depth: { min: 0, max: 0 },
			};

			const padding = 2;
			for (let i = 0; i < atoms_2.length; i++) {
				const atom = atoms_2[i];
				const [x, y, z] = atom.position;

				dimensions.width.min = Math.min(dimensions.width.min, x - padding);
				dimensions.width.max = Math.max(dimensions.width.max, x + padding);

				dimensions.height.min = Math.min(dimensions.height.min, y - padding);
				dimensions.height.max = Math.max(dimensions.height.max, y + padding);

				dimensions.depth.min = Math.min(dimensions.depth.min, z - padding);
				dimensions.depth.max = Math.max(dimensions.depth.max, z + padding);
			}

			function normalize(
				value: number,
				min: number,
				max: number,
				from: number,
				to: number
			): number {
				return (to - from) * ((value - min) / (max - min)) + from;
			}

			for (let i = 0; i < atoms_2.length; i++) {
				const atom = atoms_2[i];
				const [x, y, z] = atom.position;

				atom.position = vec3.create(
					normalize(x, dimensions.width.min, dimensions.width.max, 0, 16),
					normalize(y, dimensions.height.min, dimensions.height.max, 0, 16),
					normalize(z, dimensions.depth.min, dimensions.depth.max, 0, 16)
				);
			}

			console.time();
			const texture = await compute3DTexture({
				device,
				width: 16,
				height: 16,
				depth: 16,
				radius: 0.25,
				scale: 32,
				atoms: atoms_2,
			});
			console.timeEnd();

			const threeCamera = new THREE.PerspectiveCamera(
				60,
				window.innerWidth / window.innerHeight,
				0.1,
				2000
			);
			threeCamera.position.z = 30;

			const controls = new OrbitControls(threeCamera, canvas);
			controls.minDistance = 0;
			controls.enableDamping = true;

			const material = new RayMarchingMaterial({
				clearColor: 'white',
				fragmentColor: 'red',
				aspectRatio: threeCamera.aspect,
				cameraPosition: vec3.create(
					threeCamera.position.x,
					threeCamera.position.y,
					threeCamera.position.z
				),
				inverseProjectionMatrix: mat4.create(...threeCamera.projectionMatrixInverse.elements),
				cameraToWorldMatrix: mat4.create(...threeCamera.matrixWorld.elements),
			});

			const quad = new SceneObject(new QuadGeometry(), material, texture);
			const scene = new Scene([quad]);

			scene.load(device);

			const renderer = new Renderer({ context, device, clearColor: 'white' });

			autoResizeCanvas({
				canvas,
				device,
				onResize: (canvas) => {
					threeCamera.aspect = canvas.clientWidth / canvas.clientHeight;
					renderer.onCanvasResized(canvas.width, canvas.height);
				},
			});

			colorControl.onChange((color) => {
				material.update(device, {
					clearColor: color,
				});
				scene.load(device);
			});

			draw((deltaTime) => {
				globalState.fps = 1000 / deltaTime;

				material.update(device, {
					aspectRatio: threeCamera.aspect,
					cameraToWorldMatrix: mat4.create(...threeCamera.matrixWorld.elements),
					cameraPosition: vec3.create(
						threeCamera.position.x,
						threeCamera.position.y,
						threeCamera.position.z
					),
				});

				scene.update(deltaTime);

				controls.update(deltaTime);

				renderer.render(scene, { camera });
			});
		} catch (error) {
			alert(error);
		}
	});
</script>

<canvas
	bind:this={canvas}
	width={window.innerWidth}
	height={window.innerHeight}
	class="h-full w-full"
></canvas>
