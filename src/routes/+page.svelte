<script lang="ts">
	import FpsCounter from '$lib/components/FpsCounter.svelte';
	import { initWebGPU, draw } from '$lib/webgpu';
	import { onMount } from 'svelte';

	let fps = $state(0);
	let canvas = $state<HTMLCanvasElement>();
	onMount(async () => {
		if (canvas) {
			const webGPU = await initWebGPU({ canvas });
			console.log(webGPU);
		}

		draw((deltaTime) => {
			fps = 1000 / deltaTime;
		});
	});
</script>

<main class="relative h-screen w-screen">
	<FpsCounter class="absolute left-2 top-2" {fps} />

	<canvas bind:this={canvas} class="h-full w-full"></canvas>
</main>
