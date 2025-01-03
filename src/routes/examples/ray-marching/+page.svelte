<script lang="ts">
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { onMount } from 'svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';
	import { QuadGeometry } from '$lib/webGPU/geometry/QuadGeometry';
	import { RayMarchingMaterial } from '$lib/webGPU/material/RayMarchingMaterial';
	import { getSettings } from '$lib/settings.svelte';
	import { vec3 } from 'wgpu-matrix';
	import { compute3DTexture } from '$lib/computeShader';
	import { loadPDBLocal } from '$lib/mol/pdbLoader';
	import { createPdbGeometry } from '$lib/mol/pdbGeometry';
	import { SceneObject } from '$lib/webGPU/scene/SceneObject';
	import { Scene } from '$lib/webGPU/scene/Scene';

	let canvas = $state<HTMLCanvasElement>();

	const settings = getSettings();

	const clearColorControl = settings.addControl({
		name: 'Clear color',
		type: 'color',
		value: '#ffffff',
	});

	const fragmentColorControl = settings.addControl({
		name: 'Fragment color',
		type: 'color',
		value: '#0000ff',
	});

	const numberOfStepsControl = settings.addControl({
		name: 'Number of steps',
		type: 'range',
		value: 300,
		min: 0,
		max: 5000,
	});

	const minimumHitDistanceControl = settings.addControl({
		name: 'Minimum hit distance',
		type: 'range',
		value: 0.4,
		step: 0.01,
		min: 0,
		max: 1,
	});

	const maximumTraceDistanceControl = settings.addControl({
		name: 'Maximum trace distance',
		type: 'range',
		value: 1000,
		min: 0,
		max: 5000,
	});

	const subsurfaceDepthControl = settings.addControl({
		name: 'Subsurface depth',
		type: 'range',
		value: 2,
		step: 0.01,
		min: 0,
		max: 5,
	});

	const radiusControl = settings.addControl({
		name: 'Radius',
		type: 'range',
		value: 4,
		step: 0.5,
		min: 0,
		max: 20,
	});

	onMount(async () => {
		try {
			if (!canvas) return;

			const context = canvas.getContext('webgpu');
			if (!context) return;

			const camera = new Camera();

			const controls = new ArcballControls({ eventSource: canvas, camera, distance: 80 });

			const { device } = await initWebGPU({
				deviceOptions: (adapter) => ({
					requiredLimits: { maxBufferSize: adapter.limits.maxBufferSize },
				}),
			});

			const PDB = await loadPDBLocal('example');
			if (!PDB) return;
			const { atoms } = createPdbGeometry(PDB);

			let dimensions = {
				width: { min: 0, max: 0 },
				height: { min: 0, max: 0 },
				depth: { min: 0, max: 0 },
			};

			const padding = 10;
			for (const atom of atoms.instances) {
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

			for (const atom of atoms.instances) {
				const [x, y, z] = atom.position;

				atom.position = vec3.create(
					normalize(x, dimensions.width.min, dimensions.width.max, 0, width),
					normalize(y, dimensions.height.min, dimensions.height.max, 0, height),
					normalize(z, dimensions.depth.min, dimensions.depth.max, 0, depth)
				);
			}

			console.time('Compute SDF Texture');
			const texture = await compute3DTexture({
				device,
				width,
				height,
				depth,
				radius: 4,
				scale: 4,
				atoms,
			});
			console.timeEnd('Compute SDF Texture');

			const material = new RayMarchingMaterial({
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

			const quad = new SceneObject(new QuadGeometry(), material, [texture]);
			const scene = new Scene(quad);
			scene.load(device);

			const renderer = new Renderer({ context, device, clearColor: 'white' });
			renderer.load(scene);

			autoResizeCanvas({
				canvas,
				device,
				onResize: (canvas) => {
					camera.aspect = canvas.clientWidth / canvas.clientHeight;
					renderer.onCanvasResized(canvas.width, canvas.height);
				},
			});

			clearColorControl.onChange((clearColor) => material.update(device, { clearColor }));
			fragmentColorControl.onChange((fragmentColor) => material.update(device, { fragmentColor }));

			numberOfStepsControl.onChange((numberOfSteps) => material.update(device, { numberOfSteps }));
			maximumTraceDistanceControl.onChange((maximumTraceDistance) =>
				material.update(device, { maximumTraceDistance })
			);
			minimumHitDistanceControl.onChange((minimumHitDistance) =>
				material.update(device, { minimumHitDistance })
			);
			subsurfaceDepthControl.onChange((subsurfaceDepth) =>
				material.update(device, { subsurfaceDepth })
			);

			draw((deltaTime) => {
				globalState.fps = 1000 / deltaTime;

				controls.update(deltaTime);

				material.update(device, {
					cameraPosition: camera.position,
					projectionMatrixInverse: camera.projectionMatrixInverse,
					viewMatrixInverse: camera.viewMatrixInverse,
				});

				renderer.render(scene, { camera });
			});
		} catch (error) {
			alert(error);
		}
	});
</script>

<canvas
	bind:this={canvas}
	width={window.innerWidth}
	height={window.innerHeight}
	class="h-full w-full"
></canvas>
