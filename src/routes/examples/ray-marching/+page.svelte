<script lang="ts">
	import { getCameraContext } from '$lib/cameraControls.svelte';
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { QuadGeometry } from '$lib/webGPU/geometry/QuadGeometry';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { Scene } from '$lib/webGPU/Scene';
	import { SceneObject } from '$lib/webGPU/SceneObject';
	import { useRotatingCamera } from '$lib/rotatingCamera.svelte';
	import { onMount } from 'svelte';
	import FpsCounter from '$lib/components/FpsCounter.svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';

	let fps = $state(0);
	let canvas = $state<HTMLCanvasElement>();

	const camera = getCameraContext();
	const { rotateCamera } = useRotatingCamera(camera);

	onMount(async () => {
		if (!canvas) return;

		const context = canvas.getContext('webgpu');
		if (!context) return;

		try {
			const { device } = await initWebGPU();
			autoResizeCanvas(canvas, device);

			const geometry = new QuadGeometry();
			const material = new ColorMaterial('red');
			const quad = new SceneObject(geometry, material);

			const scene = new Scene([quad]);
			scene.load(device);

			const controls = new ArcballControls(canvas, camera);

			const renderer = new Renderer({ context, device, clearColor: 'white' });

			draw((deltaTime) => {
				fps = 1000 / deltaTime;

				rotateCamera(deltaTime);

				renderer.render(scene, camera);
			});
		} catch (error) {
			alert(error);
		}
	});
</script>

<FpsCounter class="absolute top-2 left-2" {fps} />

<canvas bind:this={canvas} class="h-full w-full"></canvas>
