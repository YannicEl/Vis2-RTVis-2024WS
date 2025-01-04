<script lang="ts">
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { ShaderMaterial } from '$lib/webGPU/material/ShaderMaterial';
	import { onMount } from 'svelte';
	import shader_2 from './copyPass.wgsl?raw';
	import { QuadGeometry } from '$lib/webGPU/geometry/QuadGeometry';
	import { Texture } from '$lib/webGPU/texture/Texture';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { globalState } from '$lib/globalState.svelte';
	import { loadPDBLocal, LOCAL_PDB_FILES } from '$lib/mol/pdbLoader';
	import { createPdbGeometry } from '$lib/mol/pdbGeometry';
	import { Camera } from '$lib/webGPU/Camera';
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { getControls } from '$lib/controls/controls.svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';
	import { vec3 } from 'wgpu-matrix';
	import { compute3DTexture } from '$lib/computeShader';
	import { RayMarchingMaterial } from '$lib/webGPU/material/RayMarchingMaterial';
	import type { Pdb } from 'pdb-parser-js/dist/pdb';
	import { Scene } from '$lib/webGPU/scene/Scene';
	import { SceneObject } from '$lib/webGPU/scene/SceneObject';
	import { CubeGeometry } from '$lib/webGPU/geometry/CubeGeometry';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { Object3D } from '$lib/webGPU/Object3D';
	import type { InstancedSceneObject } from '$lib/webGPU/scene/InstancedSceneObject';
	import { addMoleculeSelectControl } from '$lib/controls/moleculeSelectControl';
	import { addRayMarchingControls } from '$lib/controls/rayMarchingControls';

	let canvas = $state<HTMLCanvasElement>();

	const camera = new Camera();
	globalState.camera = camera;

	const controls = getControls();
	const fovControl = controls.addControl({
		name: 'FOV',
		type: 'range',
		value: 60,
		min: 0,
		max: 180,
	});
	fovControl.onChange((value) => (camera.fov = value));

	const moleculeControl = addMoleculeSelectControl();

	const rayMarchingMaterial = new RayMarchingMaterial({
		clearColor: 'white',
		fragmentColor: 'blue',
		cameraPosition: camera.position,
		projectionMatrixInverse: camera.projectionMatrixInverse,
		viewMatrixInverse: camera.viewMatrixInverse,
		numberOfSteps: 300,
		minimumHitDistance: 0.4,
		maximumTraceDistance: 1000,
		subsurfaceDepth: 2,
	});

	addRayMarchingControls(rayMarchingMaterial);

	const showCubeControl = controls.addControl({
		name: 'Show cube',
		type: 'checkbox',
		value: false,
	});

	const showSticksAndBallsControl = controls.addControl({
		name: 'Show sticks and balls',
		type: 'checkbox',
		value: true,
	});

	const showMoleculeSurfaceControl = controls.addControl({
		name: 'Show surface',
		type: 'checkbox',
		value: true,
	});

	let textureMolecules: Texture;
	let textureRaymarching: Texture;

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

		const renderer = new Renderer({ context, device, clearColor: 'white' });

		const deineMame = await loadPDBLocal(moleculeControl.value);
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

		let scenes = await getScenes();

		showCubeControl.onChange(async () => {
			scenes = await getScenes();
		});

		showSticksAndBallsControl.onChange(async () => {
			scenes = await getScenes();
		});

		showMoleculeSurfaceControl.onChange(async () => {
			scenes = await getScenes();
		});

		moleculeControl.onChange(async () => {
			PDB = await loadPDBLocal(moleculeControl.value);
			scenes = await getScenes();
		});

		const sceneCopyPass = getSceneCopyPass([textureMolecules, textureRaymarching]);

		const controls = new ArcballControls({ eventSource: canvas, camera, distance: 80 });
		globalState.contols = controls;

		draw((deltaTime) => {
			globalState.fps = 1000 / deltaTime;
			controls.update(deltaTime);

			rayMarchingMaterial.update(device, {
				cameraPosition: camera.position,
				projectionMatrixInverse: camera.projectionMatrixInverse,
				viewMatrixInverse: camera.viewMatrixInverse,
			});

			renderer.render(scenes.molecules, {
				view: textureMolecules.createView(device),
				camera,
			});

			renderer.render(scenes.rayMarching, {
				view: textureRaymarching.createView(device),
				camera,
			});

			renderer.render(sceneCopyPass, { camera });
		});

		autoResizeCanvas({
			canvas,
			device,
			onResize: (canvas) => {
				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				renderer.onCanvasResized(canvas.width, canvas.height);

				const { width, height } = canvas;
				textureMolecules.updateSize({ width, height });
				textureRaymarching.updateSize({ width, height });

				sceneCopyPass.load(device);
			},
		});

		async function getScenes() {
			const { atomsAndBonds: sticksAndBalls, atoms } = createPdbGeometry(PDB);

			const {
				scene: rayMarchingScene,
				width,
				height,
				depth,
				scale,
			} = await getSceneRaymarching(atoms);

			for (const sceneObject of sticksAndBalls) {
				for (let i = 0; i < sceneObject.count; i++) {
					const instance = sceneObject.getInstance(i);
					const [x, y, z] = instance.position;

					instance.scaleAll(vec3.create(scale, scale, scale));
					instance.setPosition(vec3.create(x * scale, y * scale, z * scale));
				}
			}

			const moleculesScene = getSceneMolecules(
				showSticksAndBallsControl.value ? sticksAndBalls : []
			);

			const geometry = new CubeGeometry(width, height, depth);
			const material = new ColorMaterial('green');
			const cube = new SceneObject(geometry, material);

			cube.load(device);

			if (showCubeControl.value) moleculesScene.add(cube);
			renderer.load(moleculesScene);

			return {
				molecules: moleculesScene,
				rayMarching: rayMarchingScene,
			};
		}

		function getSceneMolecules(sticksAndBalls: InstancedSceneObject[]) {
			const scene = new Scene(sticksAndBalls);
			scene.load(device);
			renderer.load(scene);

			return scene;
		}

		async function getSceneRaymarching(atoms: Object3D[]) {
			let dimensions = {
				width: { min: 0, max: 0 },
				height: { min: 0, max: 0 },
				depth: { min: 0, max: 0 },
			};

			const radius = 0.5;
			const padding = 0;
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

			const top_left_back = new Object3D();
			top_left_back.setPosition(vec3.create(0, height, depth));

			atoms.push(top_left_back);

			console.time('Compute SDF Texture');
			const raymarchingTexture = await compute3DTexture({
				device,
				width,
				height,
				depth,
				radius,
				scale: 10,
				atoms: atoms_2,
			});
			console.timeEnd('Compute SDF Texture');

			let scale = 1;
			while (true) {
				scale += 0.1;

				if (width * scale > 200 || height * scale > 200 || depth * scale > 200) {
					scale -= 0.1;
					break;
				}
			}

			console.log(scale);

			width *= scale;
			height *= scale;
			depth *= scale;

			console.log({ width, height, depth });

			rayMarchingMaterial.updateBufferValues({
				width: width,
				height: height,
				depth: depth,
			});

			const quad = new SceneObject(new QuadGeometry(), rayMarchingMaterial, [raymarchingTexture]);
			const scene = new Scene(quad);
			scene.load(device);

			return { scene, width, height, depth, scale };
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
