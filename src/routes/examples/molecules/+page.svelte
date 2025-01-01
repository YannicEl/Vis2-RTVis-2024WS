<script lang="ts">
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { Scene } from '$lib/webGPU/Scene';
	import { loadPDBLocal, loadPDBWeb } from '$lib/mol/pdbLoader';
	import { createPdbGeometry } from '$lib/mol/pdbGeometry';
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';
	import { getSettings } from '$lib/settings.svelte';
	import { onMount } from 'svelte';
	import type { SceneObject } from '$lib/webGPU/SceneObject';

	let canvas = $state<HTMLCanvasElement>();

	const settings = getSettings();
	const fovControl = settings.addControl({
		name: 'FOV',
		type: 'range',
		value: 60,
		min: 0,
		max: 180,
	});

	const searchControl = settings.addControl({
		name: 'Search',
		type: 'text',
		value: '8Z3K',
	});

	const buttonControl = settings.addControl({
		name: 'load',
		label: 'Load',
		type: 'button',
		value: 'load',
		async onClick() {
			console.log('load', searchControl.value);

			const PDB = await loadPDBWeb(searchControl.value);
			if (!PDB) {
				console.error(
					`PDB ${searchControl.value} not found. It may not exist or os too large to load as PDB.`
				);
				return;
			}

			console.log('PDB', PDB);

			const { atomsAndBonds: ballsAndSticks } = createPdbGeometry(PDB);
			renderPDB(ballsAndSticks);
		},
	});

	const camera = new Camera();
	globalState.camera = camera;
	fovControl.onChange((value) => (camera.fov = value));

	let device: GPUDevice;
	let renderer: Renderer;

	onMount(async () => {
		if (!canvas) return;

		const PDB = await loadPDBLocal('example');
		if (!PDB) return;
		const { atomsAndBonds: ballsAndSticks } = createPdbGeometry(PDB);

		try {
			device = (await initWebGPU()).device;

			renderPDB(ballsAndSticks);
		} catch (error) {
			alert(error);
		}
	});

	function renderPDB(geometry: SceneObject[]) {
		if (!canvas) return;

		const context = canvas.getContext('webgpu');
		if (!context) return;

		try {
			const scene = new Scene(geometry);
			scene.load(device);

			renderer = new Renderer({ context, device, clearColor: 'black' });
			renderer.load(scene);

			autoResizeCanvas({
				canvas,
				device,
				onResize: (canvas) => {
					camera.aspect = canvas.clientWidth / canvas.clientHeight;
					renderer.onCanvasResized(canvas.width, canvas.height);
				},
			});

			const controls = new ArcballControls({ eventSource: canvas, camera });
			globalState.contols = controls;

			draw((deltaTime) => {
				globalState.fps = 1000 / deltaTime;

				controls.update(deltaTime);

				renderer.render(scene, { camera });
			});
		} catch (error) {
			alert(error);
		}
	}
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
