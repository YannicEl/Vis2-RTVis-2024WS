<script lang="ts">
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { Scene } from '$lib/webGPU/Scene';
	import { SceneObject } from '$lib/webGPU/SceneObject';
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';
	import { onMount } from 'svelte';
	import { CylinderGeometry } from '$lib/webGPU/geometry/CylinderGeometry';
	import { vec3 } from 'wgpu-matrix';

	let canvas = $state<HTMLCanvasElement>();

	onMount(async () => {
		if (!canvas) return;

		const context = canvas.getContext('webgpu');
		if (!context) return;

		try {
			const { device } = await initWebGPU();

			const colorWhite = new ColorMaterial('white');
			const colorBlue = new ColorMaterial('green');
			const cylinderGeometry = new CylinderGeometry({
				radiusTop: 0.05,
				radiusBottom: 0.05,
				height: 6,
			});
			const sphereGeometry = new SphereGeometry({
				radius: 0.1,
			});

			const atom1 = new SceneObject(sphereGeometry, colorWhite);
			const atom2 = new SceneObject(sphereGeometry, colorWhite);
			const stick = new SceneObject(cylinderGeometry, colorBlue);
			const scene = new Scene([atom1, atom2, stick]);
			scene.load(device);

			atom1.setPosition(vec3.create(0, 0, 0));
			atom2.setPosition(vec3.create(1, 1, 1));

			/** Example Start */

			// Works
			/* stick.rotateX(45);
			stick.rotateZ(145) */

			// Doesn't work
			stick.rotateZ(145);
			stick.rotateX(45);

			/** Example End */

			// dynamic example
			// const direction = vec3.subtract(atom2.position, atom1.position);
			// const distance = vec3.length(direction);
			// const cylinder = new SceneObject(
			// 	new CylinderGeometry({
			// 		radiusTop: 0.05,
			// 		radiusBottom: 0.05,
			// 		height: distance,
			// 	}),
			// 	new ColorMaterial('green')
			// );

			// cylinder.setPosition(vec3.add(atom1.position, vec3.scale(direction, 0.5)));
			// TODO: rotate cylinder to direction

			const renderer = new Renderer({ context, device, clearColor: 'black' });
			const camera = new Camera();

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

				controls.update(deltaTime);

				renderer.render(scene, camera);
			});
		} catch (error) {
			alert(error);
		}
	});
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
