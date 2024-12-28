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
	import { degToRad } from '$lib/webGPU/helpers/helpers';
	import { vec3 } from 'wgpu-matrix';
	import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { compute3DTexture } from '$lib/computeShader';
	import * as THREE from 'three';

	let canvas = $state<HTMLCanvasElement>();

	const settings = getSettings();

	const rotationX = settings.addControl({
		name: 'Rotation X',
		type: 'range',
		value: 0,
		min: 0,
		max: 360,
	});

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

			const controls = new ArcballControls2({ eventSource: canvas, camera, distance: -16 });

			console.time('Compute');

			const { device } = await initWebGPU({
				deviceOptions: (adapter) => ({
					requiredLimits: { maxBufferSize: adapter.limits.maxBufferSize },
				}),
			});

			const colorMaterial = new ColorMaterial('white');
			const geometry = new SphereGeometry();

			const atom1 = new SceneObject(geometry, colorMaterial);
			atom1.setPosition(vec3.create(8, 8, 8));

			const atom2 = new SceneObject(geometry, colorMaterial);
			atom2.setPosition(vec3.create(0, 0, 8));

			const atom3 = new SceneObject(geometry, colorMaterial);
			atom3.setPosition(vec3.create(15, 0, 8));

			const atom4 = new SceneObject(geometry, colorMaterial);
			atom4.setPosition(vec3.create(0, 15, 8));

			const atom5 = new SceneObject(geometry, colorMaterial);
			atom5.setPosition(vec3.create(15, 15, 8));

			const atoms = [atom1, atom2, atom3, atom4, atom5];

			console.time();
			const texture = await compute3DTexture({
				device,
				width: 16,
				height: 16,
				depth: 16,
				radius: 3,
				scale: 16,
				atoms,
			});
			console.timeEnd();

			const threeCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 2000);
			threeCamera.position.z = 50;

			const material = new RayMarchingMaterial({
				clearColor: 'white',
				fragmentColor: 'red',
				aspectRatio: threeCamera.aspect,
				projectionMatrixInverse: new Float32Array(threeCamera.projectionMatrixInverse.elements),
				cameraToWorldMatrix: new Float32Array(threeCamera.matrixWorld.elements),
				cameraPosition: new Float32Array(threeCamera.position),
			});
			const quad = new SceneObject(new QuadGeometry(), material, texture);
			const scene = new Scene([quad]);

			scene.load(device);

			const renderer = new Renderer({ context, device, clearColor: 'white' });

			autoResizeCanvas({
				canvas,
				device,
				onResize: (canvas) => {
					camera.aspect = canvas.clientWidth / canvas.clientHeight;
					renderer.onCanvasResized(canvas.width, canvas.height);

					quad.reset();

					const nearPlaneWidth =
						camera.near * Math.tan(degToRad(camera.fov / 2)) * camera.aspect * 2;
					quad.scaleX(nearPlaneWidth);

					const nearPlaneHeight = nearPlaneWidth / camera.aspect;
					quad.scaleY(nearPlaneHeight);
				},
			});

			// fovControl.onChange((fov) => {
			// 	camera.fov = fov;

			// 	quad.reset();

			// 	const nearPlaneWidth = camera.near * Math.tan(degToRad(camera.fov / 2)) * camera.aspect * 2;
			// 	quad.scaleX(nearPlaneWidth);

			// 	const nearPlaneHeight = nearPlaneWidth / camera.aspect;
			// 	quad.scaleY(nearPlaneHeight);
			// });

			colorControl.onChange((color) => {
				material.update(device, {
					clearColor: color,
				});
				scene.load(device);
			});

			rotationX.onChange((angle) => {
				quad.setRotation(angle, vec3.create(1, 0, 0));
			});

			draw((deltaTime) => {
				globalState.fps = 1000 / deltaTime;

				controls.update(deltaTime);

				let cameraForwardPos = vec3.clone(camera.position);
				cameraForwardPos = vec3.add(cameraForwardPos, camera.front);
				cameraForwardPos = vec3.mulScalar(cameraForwardPos, camera.near);
				cameraForwardPos[2] -= camera.near;
				quad.setPosition(cameraForwardPos);
				// quad.rotate(controls.getAxis(), 1);

				material.update(device, {
					cameraPosition: camera.position,
					aspectRatio: camera.aspect,
				});
				scene.update(deltaTime);

				renderer.render(scene, camera);
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
