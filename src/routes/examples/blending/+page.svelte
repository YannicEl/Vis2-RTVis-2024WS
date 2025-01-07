<script lang="ts">
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { onMount } from 'svelte';
	import { QuadGeometry } from '$lib/webGPU/geometry/QuadGeometry';
	import { Texture } from '$lib/webGPU/texture/Texture';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { globalState } from '$lib/globalState.svelte';
	import { loadPDBLocal } from '$lib/mol/pdbLoader';
	import { createMoleculeSceneObjects, parsePdb } from '$lib/mol/pdbGeometry';
	import type { AtomData } from '$lib/mol/pdbGeometry';
	import { Camera } from '$lib/webGPU/Camera';
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';
	import { vec3 } from 'wgpu-matrix';
	import { compute3DTexture } from '$lib/computeShader';
	import { RayMarchingMaterial } from '$lib/webGPU/material/RayMarchingMaterial';
	import type { Pdb } from 'pdb-parser-js/dist/pdb';
	import { Scene } from '$lib/webGPU/scene/Scene';
	import { SceneObject } from '$lib/webGPU/scene/SceneObject';
	import { Object3D } from '$lib/webGPU/Object3D';
	import type { InstancedSceneObject } from '$lib/webGPU/scene/InstancedSceneObject';
	import { addGeneralControls } from '$lib/controls/generalControls.ts';
	import { addRayMarchingControls } from '$lib/controls/rayMarchingControls';
	import { addCameraControls } from '$lib/controls/cameraControls';
	import { addMiscControls } from '$lib/controls/miscControls.svelte';
	import { addEffectsControls } from '$lib/controls/effectsControls';

	let canvas = $state<HTMLCanvasElement>();

	const camera = new Camera();
	globalState.camera = camera;

	const generalControls = addGeneralControls();

	const rayMarchingMaterial = new RayMarchingMaterial({
		clearColor: 'white',
		fragmentColor: 'blue',
		cameraPosition: camera.position,
		projectionMatrixInverse: camera.projectionMatrixInverse,
		viewMatrixInverse: camera.viewMatrixInverse,
		numberOfSteps: 500,
		minimumHitDistance: 0.4,
		maximumTraceDistance: 1000,
		subsurfaceDepth: 2,
		maximumTransparencyDepth: 0.3,
		reflectionFactor: 0.05,
		subsurfaceScattering: 1,
		transparency: 1,
	});

	const effectControls = addEffectsControls(rayMarchingMaterial);
	addRayMarchingControls(rayMarchingMaterial);

	addCameraControls(camera);
	addMiscControls();

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

		const controls = new ArcballControls({ eventSource: canvas, camera, distance: 80 });
		globalState.contols = controls;

		const renderer = new Renderer({ context, device, clearColor: 'white' });

		const deineMame = await loadPDBLocal(generalControls.molecule.value);
		if (!deineMame) return;
		PDB = deineMame;

		const textureMolecules = new Texture({
			format: 'bgra8unorm',
			size: [canvas.width, canvas.height],
			usage:
				GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.COPY_DST |
				GPUTextureUsage.RENDER_ATTACHMENT,
		});

		let scenes = await getScenes();

		generalControls.molecule.onChange(async () => {
			PDB = await loadPDBLocal(generalControls.molecule.value);
			scenes = await getScenes();
		});

		draw((deltaTime) => {
			globalState.fps = 1000 / deltaTime;
			controls.update(deltaTime);

			rayMarchingMaterial.update(device, {
				cameraPosition: camera.position,
				projectionMatrixInverse: camera.projectionMatrixInverse,
				viewMatrixInverse: camera.viewMatrixInverse,
			});

			if (effectControls.transparency.value) {
				renderer.render(scenes.molecules, {
					view: generalControls.showMoleculeSurface.value
						? textureMolecules.createView(device)
						: undefined,
					camera,
				});
			}

			if (generalControls.showMoleculeSurface.value) {
				renderer.render(scenes.rayMarching, {
					camera,
					depth: false,
				});
			}
		});

		autoResizeCanvas({
			canvas,
			device,
			onResize: async (canvas) => {
				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				renderer.onCanvasResized(canvas.width, canvas.height);
				const { width, height } = canvas;
				textureMolecules.updateSize({ width, height });
				await scenes.rayMarching.load(device);
			},
		});

		async function getScenes() {
			const moleculeData = parsePdb(PDB);
			const { atoms, bonds } = createMoleculeSceneObjects(moleculeData);
			const sticksAndBalls = [...atoms, bonds];

			const {
				scene: rayMarchingScene,
				width,
				height,
				depth,
				scale,
			} = await getSceneRaymarching(moleculeData.atoms);

			for (const sceneObject of sticksAndBalls) {
				for (let i = 0; i < sceneObject.count; i++) {
					const instance = sceneObject.getInstance(i);
					const [x, y, z] = instance.position;

					instance.scaleAll(vec3.create(scale, scale, scale));
					instance.setPosition(vec3.create(x * scale, y * scale, z * scale));
				}
			}

			const moleculesScene = await getSceneMolecules(
				generalControls.showMoleculeStructure.value ? sticksAndBalls : []
			);

			renderer.load(moleculesScene);

			return {
				molecules: moleculesScene,
				rayMarching: rayMarchingScene,
			};
		}

		async function getSceneMolecules(sticksAndBalls: InstancedSceneObject[]) {
			const scene = new Scene(sticksAndBalls);
			await scene.load(device);
			renderer.load(scene);

			return scene;
		}

		async function getSceneRaymarching(atoms: AtomData[]) {
			let dimensions = {
				width: { min: 0, max: 0 },
				height: { min: 0, max: 0 },
				depth: { min: 0, max: 0 },
			};

			let radius = 5;
			const padding = 1;
			for (const atom of atoms) {
				const [x, y, z] = atom.position;

				dimensions.width.min = Math.min(dimensions.width.min, x - radius - padding);
				dimensions.width.max = Math.max(dimensions.width.max, x + radius + padding);

				dimensions.height.min = Math.min(dimensions.height.min, y - radius - padding);
				dimensions.height.max = Math.max(dimensions.height.max, y + radius + padding);

				dimensions.depth.min = Math.min(dimensions.depth.min, z - radius - padding);
				dimensions.depth.max = Math.max(dimensions.depth.max, z + radius + padding);
			}

			let width = dimensions.width.max - dimensions.width.min;
			let height = dimensions.height.max - dimensions.height.min;
			let depth = dimensions.depth.max - dimensions.depth.min;

			const maxDimension = 256;
			let scaleStep = 0.1;
			if (Math.max(width, height, depth) > maxDimension) {
				scaleStep = -0.1;
			}

			let scale = 1;
			while (true) {
				scale += scaleStep;

				if (scaleStep > 0) {
					if (
						width * scale > maxDimension ||
						height * scale > maxDimension ||
						depth * scale > maxDimension
					) {
						scale -= 0.1;
						break;
					}
				} else {
					if (
						width * scale < maxDimension &&
						height * scale < maxDimension &&
						depth * scale < maxDimension
					) {
						break;
					}
				}
			}

			console.log({ width, height, depth, scale });

			width *= scale;
			height *= scale;
			depth *= scale;
			// radius *= scale * 0.5;

			console.log({ width, height, depth, scale });

			const atoms_2: Object3D[] = [];
			for (const atom of atoms) {
				const [x, y, z] = atom.position;

				const newAtom = new Object3D();

				newAtom.setPosition(
					vec3.create(
						normalize(x, dimensions.width.min, dimensions.width.max, 0, width),
						normalize(y, dimensions.height.min, dimensions.height.max, 0, height),
						normalize(z, dimensions.depth.min, dimensions.depth.max, 0, depth)
					)
				);

				atoms_2.push(newAtom);
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

			console.time('Compute SDF Texture');
			const sdfTexture = await compute3DTexture({
				device,
				width,
				height,
				depth,
				radius,
				scale: 1,
				atoms: atoms_2,
			});
			console.timeEnd('Compute SDF Texture');

			rayMarchingMaterial.updateBufferValues({
				width: width,
				height: height,
				depth: depth,
			});

			const geometry = new QuadGeometry();
			const quad = new SceneObject(geometry, rayMarchingMaterial, [
				sdfTexture,
				renderer.depthTexture,
				textureMolecules,
			]);
			const scene = new Scene(quad, { depth: false });
			await scene.load(device);

			return { scene, width, height, depth, scale };
		}
	});
</script>

<canvas
	bind:this={canvas}
	width={window.innerWidth}
	height={window.innerHeight}
	class="h-full w-full"
></canvas>
