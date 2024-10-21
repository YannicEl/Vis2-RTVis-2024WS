<script lang="ts">
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { QuadGeometry } from '$lib/webGPU/geometry/QuadGeometry';
	import { TriangleGeometry } from '$lib/webGPU/geometry/TriangleGeometry';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { Scene } from '$lib/webGPU/Scene';
	import { SceneObject } from '$lib/webGPU/SceneObject';
	import { loadPDB } from '$lib/mol/pdbLoader';
	import { renderPDB } from '$lib/mol/pdbRender';
	import { onMount } from 'svelte';
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';

	let canvas = $state<HTMLCanvasElement>();

	const camera = new Camera();
	globalState.camera = camera;

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

		const context = canvas.getContext('webgpu');
		if (!context) return;

		try {
			const camera = new Camera();
			globalState.camera = camera;

			const { device } = await initWebGPU();
			autoResizeCanvas({
				canvas,
				device,
				onResize: (canvas) => {
					camera.aspect = canvas.clientWidth / canvas.clientHeight;
				},
			});

			const scene = new Scene([triangle, ...atoms]);
			scene.load(device);

			const renderer = new Renderer({ context, device, clearColor: 'white' });

			const controls = new ArcballControls({ camera });
			globalState.contols = controls;

			triangle.setPosition(0, 1, -10);

			draw((deltaTime) => {
				globalState.fps = 1000 / deltaTime;

				triangle.rotateY(0.0001 * deltaTime);
				triangle.rotateX(0.0005 * deltaTime);

				// triangle.moveX(0.0001 * deltaTime);#

				controls.update(deltaTime);

				renderer.render(scene, camera);
			});
		} catch (error) {
			alert(error);
		}
	});
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
