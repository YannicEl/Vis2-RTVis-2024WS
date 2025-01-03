<script lang="ts">
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { loadPDBLocal } from '$lib/mol/pdbLoader';
	import type { PdbFile } from '$lib/mol/pdbLoader';
	import { createPdbGeometry } from '$lib/mol/pdbGeometry';
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';
	import { getSettings } from '$lib/settings.svelte';
	import { onMount } from 'svelte';
	import { Scene } from '$lib/webGPU/scene/Scene';

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
	});

	const camera = new Camera();
	globalState.camera = camera;
	fovControl.onChange((value) => (camera.fov = value));

	onMount(async () => {
		if (!canvas) return;

		const context = canvas.getContext('webgpu');
		if (!context) return;

		try {
			const controls = new ArcballControls({ eventSource: canvas, camera });
			globalState.contols = controls;

			const { device } = await initWebGPU();

			const renderer = new Renderer({ context, device, clearColor: 'black' });

			let scene = await updateScene('example');

			if (buttonControl.params?.type === 'button') {
				buttonControl.params.onClick = async () => {
					scene = await updateScene(searchControl.value as PdbFile);
				};
			}

			autoResizeCanvas({
				canvas,
				device,
				onResize: (canvas) => {
					camera.aspect = canvas.clientWidth / canvas.clientHeight;
					renderer.onCanvasResized(canvas.width, canvas.height);
				},
			});

			draw((deltaTime) => {
				globalState.fps = 1000 / deltaTime;

				controls.update(deltaTime);

				renderer.render(scene, { camera });
			});

			async function updateScene(pdbFile: PdbFile): Promise<Scene> {
				const PDB = await loadPDBLocal(pdbFile);
				if (!PDB)
					throw new Error(
						`PDB ${pdbFile} not found. It may not exist or os too large to load as PDB.`
					);
				const { atomsAndBonds: ballsAndSticks } = createPdbGeometry(PDB);

				const scene = new Scene(ballsAndSticks);

				scene.load(device);
				renderer.load(scene);

				return scene;
			}
		} catch (error) {
			alert(error);
		}
	});
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
