<script lang="ts">
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { loadPDBLocal } from '$lib/mol/pdbLoader';
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

	const searchLocalControl = settings.addControl({
		name: 'Search Local',
		type: 'select',
		value: 'example',
		options: [
			{
				label: 'Example',
				value: 'example',
			},
			{
				label: '1JJJ',
				value: '1jjj',
			},
			{
				label: '4NKG',
				value: '4nkg',
			},
			{
				label: '1AF6',
				value: '1af6',
			},
			{
				label: '5XYU',
				value: '5xyu',
			},
			{
				label: 'Random molecules ↓',
				value: '',
			},
			{
				label: '3IZ8',
				value: '3iz8',
			},
			{
				label: '8Z3K',
				value: '8z3k',
			},
		],
	});

	const searchOnlineControl = settings.addControl({
		name: 'Search',
		type: 'text',
		value: '',
	});

	const searchOnlineButton = settings.addControl({
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

			if (searchOnlineButton.params?.type === 'button') {
				searchOnlineButton.params.onClick = async () => {
					scene = await updateScene(searchOnlineControl.value);
				};
			}

			searchLocalControl.onChange(async (value) => {
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

			async function updateScene(pdbFile: string): Promise<Scene> {
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
