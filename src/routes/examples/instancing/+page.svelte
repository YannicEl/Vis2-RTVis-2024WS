<script lang="ts">
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { onMount } from 'svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';
	import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
	import { ShaderMaterial } from '$lib/webGPU/material/ShaderMaterial';
	import shader from './instance.wgsl?raw';
	import { Color, CSS_COLORS } from '$lib/webGPU/color/Color';
	import { getSettings } from '$lib/settings.svelte';
	import { UniformBuffer } from '$lib/webGPU/utils/UniformBuffer';
	import { mat4, vec3 } from 'wgpu-matrix';
	import { Texture } from '$lib/webGPU/texture/Texture';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { InstancedSceneObject } from '$lib/webGPU/InstancedSceneObject';
	import { Scene } from '$lib/webGPU/Scene';
	import { Renderer } from '$lib/webGPU/Renderer';

	let canvas = $state<HTMLCanvasElement>();

	const settings = getSettings();

	const instanceCountControl = settings.addControl({
		name: 'Instance count',
		type: 'range',
		value: 100,
		min: 1,
		max: 200_000,
	});

	onMount(async () => {
		try {
			if (!canvas) return;

			const context = canvas.getContext('webgpu');
			if (!context) return;

			const camera = new Camera();

			const controls = new ArcballControls({ eventSource: canvas, camera, distance: 1 });

			const { device } = await initWebGPU({
				deviceOptions: (adapter) => ({
					requiredLimits: {
						maxBufferSize: adapter.limits.maxBufferSize,
					},
				}),
			});

			const geometry = new SphereGeometry({ radius: 0.1 });
			const material = new ColorMaterial('red', { instanced: true });

			let scene = getScene();

			const renderer = new Renderer({ context, device, clearColor: 'white' });

			instanceCountControl.onChange((_) => {
				scene = getScene();
			});

			draw((deltaTime) => {
				globalState.fps = 1000 / deltaTime;

				controls.update(deltaTime);

				renderer.render(scene, { camera });
			});

			function getScene(): Scene {
				const sphere = new InstancedSceneObject(geometry, material, instanceCountControl.value);

				const scene = new Scene(sphere);
				scene.load(device);

				sphere.instances.forEach((instance) => {
					instance.translate(vec3.create(rand(-0.9, 0.9), rand(-0.9, 0.9), rand(-0.9, 0.9)));
				});

				return scene;
			}
		} catch (error) {
			alert(error);
		}
	});

	function rand(min: number, max: number): number {
		return min + Math.random() * (max - min);
	}
</script>

<canvas
	bind:this={canvas}
	width={window.innerWidth}
	height={window.innerHeight}
	class="h-full w-full"
></canvas>
