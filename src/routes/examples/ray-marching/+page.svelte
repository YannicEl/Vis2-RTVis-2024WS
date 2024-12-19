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
	import { Texture } from '$lib/webGPU/texture/Texture';
	import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import type { Object3D } from '$lib/webGPU/Object3D';

	let canvas = $state<HTMLCanvasElement>();

	const settings = getSettings();
	const fovControl = settings.addControl({
		name: 'FOV',
		type: 'range',
		value: 60,
		min: 0,
		max: 180,
	});

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
		value: 'red',
		options: [
			{ label: 'Red', value: 'red' },
			{ label: 'Green', value: 'green' },
			{ label: 'Blue', value: 'blue' },
		],
	});

	const depthControl = settings.addControl({
		name: 'Depth',
		type: 'range',
		value: 0,
		min: 0,
		step: 1,
		max: 10,
	});

	const camera = new Camera();
	fovControl.onChange((value) => (camera.fov = value));
	globalState.camera = camera;

	const colorWhite = new ColorMaterial('white');
	const colorBlue = new ColorMaterial('green');
	const sphereGeometry = new SphereGeometry({
		radius: 0.1,
	});

	const atom1 = new SceneObject(sphereGeometry, colorWhite);
	const atom2 = new SceneObject(sphereGeometry, colorWhite);
	atom1.setPosition(vec3.create(0, 0, 0));
	atom2.setPosition(vec3.create(1, 2, 0));

	const atoms = [atom1, atom2];

	const geometry = new QuadGeometry();
	const material = new RayMarchingMaterial({
		clearColor: 'red',
		fragmentColor: 'white',
		cameraPosition: camera.position,
		aspectRatio: camera.aspect,
		depth: depthControl.value,
	});

	function calculateBoundingBox(atoms: Object3D[]) {
		const radius = 1;
		const dimension = {
			x: { min: 0, max: 0 },
			y: { min: 0, max: 0 },
			z: { min: 0, max: 0 },
		};

		for (const atom of atoms) {
			const [x, y, z] = atom.position;
			dimension.x.min = Math.min(x, dimension.x.min + radius);
			dimension.x.max = Math.max(x, dimension.x.max + radius);

			dimension.y.min = Math.min(y, dimension.y.min + radius);
			dimension.y.max = Math.max(y, dimension.y.max + radius);

			dimension.z.min = Math.min(z, dimension.z.min + radius);
			dimension.z.max = Math.max(z, dimension.z.max + radius);
		}

		return {
			width: dimension.x.max - dimension.x.min,
			height: dimension.y.max - dimension.y.min,
			depth: dimension.z.max - dimension.z.min,
		};
	}

	const boundingBox = calculateBoundingBox(atoms);
	console.log(boundingBox);

	let width = 5;
	let height = 7;
	let depth = 3;
	const _ = [255, 0, 0, 255]; // red
	const y = [255, 255, 0, 255]; // yellow
	const g = [0, 255, 0, 255]; // yellow
	const b = [0, 0, 255, 255]; // blue
	const k = [0, 0, 0, 0]; // black

	// prettier-ignore
	let data = new Uint8Array([
      _, _, _, _, _,
      _, y, y, y, _,
      _, y, _, _, _,
      _, y, y, _, _,
      _, y, _, _, _,
      _, y, _, _, _,
      _, _, _, _, _,

      g, k, k, k, k,
      k, y, y, y, k,
      k, y, k, k, k,
      k, y, y, k, k,
      k, y, k, k, k,
      k, y, k, k, k,
      k, k, k, k, k,

      b, b, b, b, b,
      b, y, y, y, b,
      b, y, b, b, b,
      b, y, y, b, b,
      b, y, b, b, b,
      b, y, b, b, b,
      b, b, b, b, b,  
    ].flat());

	width = 1;
	height = 1;
	data = new Uint8Array([50, 125, 255]);
	depth = 3;

	const texture = new Texture({
		data,
		descriptor: {
			label: 'Ray Marching Texture',
			format: 'r8unorm',
			dimension: '3d',
			size: { width, height, depthOrArrayLayers: depth },
		},
	});

	const quad = new SceneObject(geometry, material, texture);

	const scene = new Scene([quad]);

	onMount(async () => {
		if (!canvas) return;

		const context = canvas.getContext('webgpu');
		if (!context) return;

		try {
			const { device } = await initWebGPU();

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

			fovControl.onChange((fov) => {
				camera.fov = fov;

				quad.reset();

				const nearPlaneWidth = camera.near * Math.tan(degToRad(camera.fov / 2)) * camera.aspect * 2;
				quad.scaleX(nearPlaneWidth);

				const nearPlaneHeight = nearPlaneWidth / camera.aspect;
				quad.scaleY(nearPlaneHeight);
			});

			depthControl.onChange((value) => {
				material.update(device, {
					depth: value / (depth - 1),
				});
				scene.load(device);
			});

			colorControl.onChange((color) => {
				material.update(device, {
					clearColor: color,
				});
				scene.load(device);
			});

			const controls = new ArcballControls2({ eventSource: canvas, camera, distance: 2.1 });
			globalState.contols = controls;

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
