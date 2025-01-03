<script lang="ts">
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { ShaderMaterial } from '$lib/webGPU/material/ShaderMaterial';
	import { onMount } from 'svelte';
	import shader_2 from './copyPass.wgsl?raw';
	import { QuadGeometry } from '$lib/webGPU/geometry/QuadGeometry';
	import { Texture } from '$lib/webGPU/texture/Texture';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { globalState } from '$lib/globalState.svelte';
	import { loadPDBLocal } from '$lib/mol/pdbLoader';
	import { createPdbGeometry } from '$lib/mol/pdbGeometry';
	import { Camera } from '$lib/webGPU/Camera';
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { getSettings } from '$lib/settings.svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';
	import { vec3 } from 'wgpu-matrix';
	import { compute3DTexture } from '$lib/computeShader';
	import { RayMarchingMaterial } from '$lib/webGPU/material/RayMarchingMaterial';
	import type { Pdb } from 'pdb-parser-js/dist/pdb';
	import { Scene } from '$lib/webGPU/scene/Scene';
	import { SceneObject } from '$lib/webGPU/scene/SceneObject';

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

	let textureMolecules: Texture;
	let textureRaymarching: Texture;

	let raymarchingMaterial: RayMarchingMaterial;

	let PDB: Pdb;

	onMount(async () => {
		if (!canvas) return;

		const context = canvas.getContext('webgpu');
		if (!context) return;

		const { device } = await initWebGPU({
			deviceOptions: (adapter) => ({
				requiredLimits: { maxBufferSize: adapter.limits.maxBufferSize },
			}),
		});

		const deineMame = await loadPDBLocal('example');
		if (!deineMame) return;
		PDB = deineMame;

		textureMolecules = new Texture({
			format: 'bgra8unorm',
			size: [canvas.width, canvas.height],
			usage:
				GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.COPY_DST |
				GPUTextureUsage.RENDER_ATTACHMENT,
		});

		textureRaymarching = new Texture({
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

		// TODO: insert more render passes here

		const sceneRaymarching = await getSceneRaymarching();

		let sceneCopyPass = getSceneCopyPass([textureMolecules, textureRaymarching]);

		const renderer = new Renderer({ context, device, clearColor: 'white' });

		autoResizeCanvas({
			canvas,
			device,
			onResize: (canvas) => {
				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				renderer.onCanvasResized(canvas.width, canvas.height);

				textureMolecules = new Texture({
					format: 'bgra8unorm',
					size: [canvas.width, canvas.height],
					usage:
						GPUTextureUsage.TEXTURE_BINDING |
						GPUTextureUsage.COPY_DST |
						GPUTextureUsage.RENDER_ATTACHMENT,
				});

				textureRaymarching = new Texture({
					format: 'bgra8unorm',
					size: [canvas.width, canvas.height],
					usage:
						GPUTextureUsage.TEXTURE_BINDING |
						GPUTextureUsage.COPY_DST |
						GPUTextureUsage.RENDER_ATTACHMENT,
				});

				sceneCopyPass = getSceneCopyPass([textureMolecules, textureRaymarching]);
			},
		});

		const controls = new ArcballControls({ eventSource: canvas, camera });
		globalState.contols = controls;

		draw((deltaTime) => {
			globalState.fps = 1000 / deltaTime;
			controls.update(deltaTime);

			raymarchingMaterial.update(device, {
				cameraPosition: camera.position,
				projectionMatrixInverse: camera.projectionMatrixInverse,
				viewMatrixInverse: camera.viewMatrixInverse,
			});

			// renderer.render(sceneMolecules, { camera });
			renderer.render(sceneMolecules, {
				view: textureMolecules.createView(device),
				camera: camera,
			});
			// renderer.render(sceneRaymarching, { camera: camera });
			renderer.render(sceneRaymarching, {
				view: textureRaymarching.createView(device),
				camera: camera,
			});
			renderer.render(sceneCopyPass, { camera });
		});

		async function getSceneMolecules() {
			const { atomsAndBonds: ballsAndSticks } = createPdbGeometry(PDB);
			const scene = new Scene(ballsAndSticks);
			scene.load(device);

			return scene;
		}

		async function getSceneRaymarching() {
			let dimensions = {
				width: { min: 0, max: 0 },
				height: { min: 0, max: 0 },
				depth: { min: 0, max: 0 },
			};

			const { atoms } = createPdbGeometry(PDB);

			const padding = 10;
			for (const atom of atoms) {
				const [x, y, z] = atom.position;

				dimensions.width.min = Math.min(dimensions.width.min, x - padding);
				dimensions.width.max = Math.max(dimensions.width.max, x + padding);

				dimensions.height.min = Math.min(dimensions.height.min, y - padding);
				dimensions.height.max = Math.max(dimensions.height.max, y + padding);

				dimensions.depth.min = Math.min(dimensions.depth.min, z - padding);
				dimensions.depth.max = Math.max(dimensions.depth.max, z + padding);
			}

			function normalize(
				value: number,
				min: number,
				max: number,
				from: number,
				to: number
			): number {
				return (to - from) * ((value - min) / (max - min)) + from;
			}

			const width = 128;
			const height = 128;
			const depth = 128;

			for (const atom of atoms) {
				const [x, y, z] = atom.position;

				atom.position = vec3.create(
					normalize(x, dimensions.width.min, dimensions.width.max, 0, width),
					normalize(y, dimensions.height.min, dimensions.height.max, 0, height),
					normalize(z, dimensions.depth.min, dimensions.depth.max, 0, depth)
				);
			}

			console.time('Compute SDF Texture');
			const raymarchingTexture = await compute3DTexture({
				device,
				width,
				height,
				depth,
				radius: 4,
				scale: 4,
				atoms,
			});
			console.timeEnd('Compute SDF Texture');

			raymarchingMaterial = new RayMarchingMaterial({
				clearColor: 'white',
				fragmentColor: 'blue',
				cameraPosition: camera.position,
				projectionMatrixInverse: camera.projectionMatrixInverse,
				viewMatrixInverse: camera.viewMatrixInverse,
				numberOfSteps: 1000,
				minimumHitDistance: 0.001,
				maximumTraceDistance: 1000,
				subsurfaceDepth: 2,
			});

			const quad = new SceneObject(new QuadGeometry(), raymarchingMaterial, [raymarchingTexture]);
			const scene = new Scene(quad);
			scene.load(device);

			return scene;
		}

		function getSceneCopyPass(textures: Texture[]): Scene {
			const geometry = new QuadGeometry();
			const material = new ShaderMaterial(shader_2, { requiresModelUniforms: false });
			const quad = new SceneObject(geometry, material, textures);
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
