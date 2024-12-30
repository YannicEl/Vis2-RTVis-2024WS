<script lang="ts">
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { ShaderMaterial } from '$lib/webGPU/material/ShaderMaterial';
	import { onMount } from 'svelte';
	import shader_1 from './blend_1.wgsl?raw';
	import shader_2 from './blend_2.wgsl?raw';
	import { QuadGeometry } from '$lib/webGPU/geometry/QuadGeometry';
	import { SceneObject } from '$lib/webGPU/SceneObject';
	import { Texture } from '$lib/webGPU/texture/Texture';
	import { Scene } from '$lib/webGPU/Scene';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { globalState } from '$lib/globalState.svelte';
	import { loadPDBLocal, loadPDBWeb } from '$lib/mol/pdbLoader';
	import { createPdbGeometry } from '$lib/mol/pdbGeometry';
	import { Camera } from '$lib/webGPU/Camera';
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { getSettings } from '$lib/settings.svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';

	let canvas = $state<HTMLCanvasElement>();

	const settings = getSettings();
	const fovControl = settings.addControl({
		name: 'FOV',
		type: 'range',
		value: 60,
		min: 0,
		max: 180,
	});
	fovControl.onChange((value) => (camera.fov = value));

	const camera = new Camera();
	globalState.camera = camera;

	onMount(async () => {
		if (!canvas) return;

		const context = canvas.getContext('webgpu');
		if (!context) return;

		const { device } = await initWebGPU();

		const texture = new Texture({
			format: 'bgra8unorm',
			size: [canvas.width, canvas.height],
			usage:
				GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.COPY_DST |
				GPUTextureUsage.RENDER_ATTACHMENT,
		});

		const sceneMolecules = await getSceneMolecules();
		if (!sceneMolecules) {
			console.error('Failed to load sceneMolecules');
			return;
		}

		const scene2 = getScene2(texture);

		const renderer = new Renderer({ context, device, clearColor: 'black' });

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

			// renderer.render(sceneMolecules, { camera });
			renderer.render(sceneMolecules, { view: texture.createView(device), camera: camera });
			renderer.render(scene2);
		});

		async function getSceneMolecules() {
			const PDB = await loadPDBLocal('example');
			if (!PDB) return;
			const ballsAndSticks = createPdbGeometry(PDB);

			const scene = new Scene(ballsAndSticks);
			scene.load(device);

			return scene;
		}

		function getScene2(texture: Texture): Scene {
			const geometry = new QuadGeometry();
			const material = new ShaderMaterial(shader_2, { requiresModelUniforms: false });
			const quad = new SceneObject(geometry, material, texture);
			const scene = new Scene([quad]);
			scene.load(device);

			return scene;
		}
	});
</script>

<canvas
	bind:this={canvas}
	width={window.innerWidth}
	height={window.innerHeight}
	class="h-full w-full"
></canvas>
