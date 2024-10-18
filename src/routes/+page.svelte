<script lang="ts">
	import { setCameraContext } from '$lib/cameraControlls.svelte';
	import BottomControls from '$lib/components/BottomControls.svelte';
	import FpsCounter from '$lib/components/FpsCounter.svelte';
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { Camera } from '$lib/webGPU/Camera';
	import { QuadGeometry } from '$lib/webGPU/geometry/QuadGeometry';
	import { TriangleGeometry } from '$lib/webGPU/geometry/TriangleGeometry';
	import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { RayMarchingMaterial } from '$lib/webGPU/material/RayMarchingMaterial';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { Scene } from '$lib/webGPU/Scene';
	import { SceneObject } from '$lib/webGPU/SceneObject';
	import { onDestroy, onMount } from 'svelte';
	import { loadPDB } from '$lib/mol/pdbLoader';
	import { renderPDB } from '$lib/mol/pdbRender';

	let fps = $state(0);
	let canvas = $state<HTMLCanvasElement>();

	const camera = new Camera();
	setCameraContext(camera);

	// const geometry = new SphereGeometry();
	const geometry = new TriangleGeometry();
	const material = new ColorMaterial('black');
	// const material = new RayMarchingMaterial();
	const triangle = new SceneObject(geometry, material);

	const quadGeometry = new QuadGeometry();
	const quadMaterial = new ColorMaterial('red');
	const quad = new SceneObject(quadGeometry, quadMaterial);

	onMount(async () => {
		if (!canvas) return;

		const PDB = await loadPDB('example');
		if (!PDB) return;
		console.log(PDB);
		const atoms = renderPDB(PDB);

		const scene = new Scene([triangle, ...atoms]);

		const context = canvas.getContext('webgpu');
		if (!context) return;

		try {
			const { device } = await initWebGPU();
			scene.load(device);

			autoResizeCanvas(canvas, device);

			const renderer = new Renderer({ context, device, clearColor: 'white' });

			triangle.setPosition(0, 1, -10);

			draw((deltaTime) => {
				fps = 1000 / deltaTime;

				triangle.rotateY(0.0001 * deltaTime);
				triangle.rotateX(0.0005 * deltaTime);

				// triangle.moveX(0.0001 * deltaTime);

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
