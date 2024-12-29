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
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';

	let canvas = $state<HTMLCanvasElement>();

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

		const scene1 = getScene1();
		const scene2 = getScene2(texture);

		const renderer = new Renderer({ context, device, clearColor: 'white' });
		const camera = new Camera();

		draw((deltaTime) => {
			globalState.fps = 1000 / deltaTime;

			renderer.render(scene1, camera, texture.createView(device));
			renderer.render(scene2, camera);
		});

		function getScene1(): Scene {
			const geometry = new QuadGeometry();
			const material = new ShaderMaterial(shader_1);
			const quad = new SceneObject(geometry, material);
			const scene = new Scene([quad]);
			scene.load(device);

			return scene;
		}

		function getScene2(texture: Texture): Scene {
			const geometry = new QuadGeometry();
			const material = new ShaderMaterial(shader_2);
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
