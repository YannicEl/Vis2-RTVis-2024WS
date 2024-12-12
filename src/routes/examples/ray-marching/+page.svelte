<script lang="ts">
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { Scene } from '$lib/webGPU/Scene';
	import { SceneObject } from '$lib/webGPU/SceneObject';
	import { onMount } from 'svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';
	import { QuadGeometry } from '$lib/webGPU/geometry/QuadGeometry';
	import { RayMarchingMaterial } from '$lib/webGPU/material/RayMarchingMaterial';
	import { getSettings } from '$lib/settings.svelte';
	import { degToRad } from '$lib/webGPU/helpers/helpers';
	import { vec3 } from 'wgpu-matrix';
	import { Color } from '$lib/webGPU/color/Color';

	let canvas = $state<HTMLCanvasElement>();

	const settings = getSettings();
	const fovControl = settings.addControl({
		name: 'FOV',
		type: 'range',
		value: 60,
		min: 0,
		max: 180,
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

	const camera = new Camera();
	camera.setPosition(vec3.create(0, 0, -4));
	fovControl.onChange((value) => (camera.fov = value));
	globalState.camera = camera;

	const geometry = new QuadGeometry();
	const material = new RayMarchingMaterial({
		clearColor: 'red',
		fragmentColor: 'white',
		cameraPosition: camera.position,
	});
	const quad = new SceneObject(geometry, material);

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

			colorControl.onChange((color) => {
				material.update(device, {
					clearColor: color,
				});
				scene.load(device);
			});

			const controls = new ArcballControls({ eventSource: canvas, camera, distance: 2.1 });
			globalState.contols = controls;

			draw((deltaTime) => {
				globalState.fps = 1000 / deltaTime;

				let cameraForwardPos = vec3.clone(camera.position);
				cameraForwardPos = vec3.add(cameraForwardPos, camera.front);
				cameraForwardPos = vec3.mulScalar(cameraForwardPos, camera.near);
				cameraForwardPos[2] -= camera.near;
				quad.setPosition(cameraForwardPos);
				// quad.rotate(controls.getAxis(), 1);

				controls.update(deltaTime);
				// material.update(device, { cameraPosition: camera.position });
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
