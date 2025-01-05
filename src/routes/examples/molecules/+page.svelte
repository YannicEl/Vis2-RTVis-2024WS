<script lang="ts">
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { loadPDBLocal } from '$lib/mol/pdbLoader';
	import type { PdbFile } from '$lib/mol/pdbLoader';
	import { createPdbGeometry } from '$lib/mol/pdbGeometry';
	import { loadMmcifLocal } from '$lib/mol/mmcifLoader';
	import { createMmcifGeometry } from '$lib/mol/mmcifGeometry';
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';
	import { getControls } from '$lib/controls/controls.svelte';
	import { onMount } from 'svelte';
	import { Scene } from '$lib/webGPU/scene/Scene';
	import { addGeneralControls } from '$lib/controls/generalControls.ts';

	let canvas = $state<HTMLCanvasElement>();

	const controls = getControls();
	const fovControl = controls.addControl({
		name: 'FOV',
		type: 'range',
		value: 60,
		min: 0,
		max: 180,
	});

	const generalControls = addGeneralControls();

	const searchOnlineControl = controls.addControl({
		name: 'Search',
		type: 'text',
		value: '',
	});

	const searchOnlineButton = controls.addControl({
		name: 'load',
		label: 'Load (Online)',
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
			// let scene = await updateScene('1jjj', true);

			if (searchOnlineButton.params?.type === 'button') {
				searchOnlineButton.params.onClick = async () => {
					scene = await updateScene(searchOnlineControl.value);
				};
			}

			generalControls.molecule.onChange(async (value) => {
				if (!value) return;

				scene = await updateScene(value);
			});

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

			async function updateScene(fileName: PdbFile, cif: boolean = false): Promise<Scene> {
				let ballsAndSticks;
				if (!cif) {
					const PDB = await loadPDBLocal(fileName);
					if (!PDB)
						throw new Error(
							`PDB ${fileName} not found. It may not exist or is too large to load as PDB.`
						);
					ballsAndSticks = createPdbGeometry(PDB).atomsAndBonds;
				} else {
					const CIF = await loadMmcifLocal(fileName);
					if (!CIF)
						throw new Error(
							`CIF ${fileName} not found. It may not exist or is too large to load as CIF.`
						);
					ballsAndSticks = createMmcifGeometry(CIF.atoms, CIF.bonds);
				}

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
