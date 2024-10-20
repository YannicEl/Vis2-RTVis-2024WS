<script lang="ts">
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { Scene } from '$lib/webGPU/Scene';
	import { SceneObject } from '$lib/webGPU/SceneObject';
	import { onMount } from 'svelte';
	import FpsCounter from '$lib/components/FpsCounter.svelte';
	import { ArcballControls, type Input } from '$lib/webGPU/controls/ArcballControls';
	import { CubeGeometry } from '$lib/webGPU/geometry/CubeGeometry';
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';

	let fps = $state(0);
	let canvas = $state<HTMLCanvasElement>();

	onMount(async () => {
		if (!canvas) return;

		const context = canvas.getContext('webgpu');
		if (!context) return;

		try {
			const camera = new Camera();
			globalState.camera = camera;

			const { device } = await initWebGPU();
			autoResizeCanvas({
				canvas,
				device,
				onResize: (canvas) => {
					camera.aspect = canvas.clientWidth / canvas.clientHeight;
				},
			});

			const geometry = new CubeGeometry();
			const material = new ColorMaterial('red');
			const quad = new SceneObject(geometry, material);

			const scene = new Scene([quad]);
			scene.load(device);

			const controls = new ArcballControls({ camera });

			const renderer = new Renderer({ context, device, clearColor: 'white' });

			const input: Input = {
				touching: false,
				zoom: 0,
				x: 0,
				y: 0,
			};

			canvas.onpointermove = (event) => {
				input.touching = event.pointerType == 'mouse' ? (event.buttons & 1) !== 0 : true;
				if (input.touching) {
					input.x += event.movementX;
					input.y += event.movementY;
				}
			};

			canvas.onwheel = (e) => {
				// The scroll value varies substantially between user agents / browsers.
				// Just use the sign.
				input.zoom += Math.sign(e.deltaY);
				e.preventDefault();
				e.stopPropagation();
			};

			// input.y = 1000;

			draw((deltaTime) => {
				fps = 1000 / deltaTime;

				controls.update(deltaTime, input);
				input.touching = false;
				input.x = 0;
				input.y = 0;
				input.zoom = 0;

				renderer.render(scene, camera);
			});
		} catch (error) {
			alert(error);
		}
	});
</script>

<FpsCounter class="absolute top-2 left-2" {fps} />

<canvas bind:this={canvas} class="h-full w-full"></canvas>
