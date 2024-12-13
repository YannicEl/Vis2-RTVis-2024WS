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

	const camera = new Camera();
	fovControl.onChange((value) => (camera.fov = value));
	globalState.camera = camera;

	const geometry = new QuadGeometry();
	const material = new RayMarchingMaterial({
		clearColor: 'red',
		fragmentColor: 'white',
		cameraPosition: camera.position,
		aspectRatio: camera.aspect,
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

			fovControl.onChange((fov) => {
				camera.fov = fov;

				quad.reset();

				const nearPlaneWidth = camera.near * Math.tan(degToRad(camera.fov / 2)) * camera.aspect * 2;
				quad.scaleX(nearPlaneWidth);

				const nearPlaneHeight = nearPlaneWidth / camera.aspect;
				quad.scaleY(nearPlaneHeight);
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

				// rotation
				// let diff = vec3.sub(quad.position, camera.position);
				// let dist = vec3.length(diff);
				// // stick.scaleY(dist);

				// let u1 = vec3.create(0, 1, 0);
				// let u2 = vec3.divScalar(diff, dist);
				// let dot_u1u2 = vec3.dot(u1, u2);
				// let angle = Math.acos(dot_u1u2);
				// let axis = vec3.cross(u1, u2);
				// quad.setRotation((180 * angle) / Math.PI, axis);

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
