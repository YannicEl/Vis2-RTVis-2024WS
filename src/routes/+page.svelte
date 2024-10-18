<script lang="ts">
	import { setCameraContext } from '$lib/cameraControlls.svelte';
	import BottomControls from '$lib/components/BottomControls.svelte';
	import FpsCounter from '$lib/components/FpsCounter.svelte';
	import { Camera } from '$lib/webGPU/Camera';
	import { CubeGeometry } from '$lib/webGPU/geometry/CubeGeometry';
	import { TriangleGeometry } from '$lib/webGPU/geometry/TriangleGeometry';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { Scene } from '$lib/webGPU/Scene';
	import { SceneObject } from '$lib/webGPU/SceneObject';
	import { onMount } from 'svelte';

	let fps = $state(0);
	let canvas = $state<HTMLCanvasElement>();

	const camera = new Camera();
	setCameraContext(camera);

	// const geometry = new TriangleGeometry();
	const geometry = new CubeGeometry();
	const material = new ColorMaterial('#ff0000');
	const triangle = new SceneObject(geometry, material);

	const scene = new Scene([triangle]);

	onMount(async () => {
		if (!canvas) return;

		try {
			const webGPU = await initWebGPU();
			scene.load(webGPU.device);

			const renderer = new Renderer(canvas, webGPU.device);

			draw((deltaTime) => {
				fps = 1000 / deltaTime;

				triangle.rotateY(0.0001 * deltaTime);
				triangle.rotateX(0.0005 * deltaTime);

				renderer.render(scene, camera);
			});
		} catch (error) {
			alert(error);
		}
	});
</script>

<main class="relative h-screen w-screen">
	<FpsCounter class="absolute top-2 left-2" {fps} />

	<BottomControls class="absolute right-0 bottom-4 left-0 mx-auto w-min" />

	<canvas bind:this={canvas} class="h-full w-full"></canvas>
</main>
