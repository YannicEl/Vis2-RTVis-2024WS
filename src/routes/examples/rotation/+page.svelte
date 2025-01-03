<script lang="ts">
	import { autoResizeCanvas } from '$lib/resizeableCanvas';
	import { SphereGeometry } from '$lib/webGPU/geometry/SphereGeometry';
	import { draw, initWebGPU } from '$lib/webGPU/helpers/webGpu';
	import { ColorMaterial } from '$lib/webGPU/material/ColorMaterial';
	import { Renderer } from '$lib/webGPU/Renderer';
	import { Camera } from '$lib/webGPU/Camera';
	import { globalState } from '$lib/globalState.svelte';
	import { ArcballControls } from '$lib/webGPU/controls/ArcballControls';
	import { onMount } from 'svelte';
	import { CylinderGeometry } from '$lib/webGPU/geometry/CylinderGeometry';
	import { vec3 } from 'wgpu-matrix';
	import { SceneObject } from '$lib/webGPU/scene/SceneObject';
	import { Scene } from '$lib/webGPU/scene/Scene';

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
				height: 1,
			});
			const sphereGeometry = new SphereGeometry({
				radius: 0.1,
			});

			const atom_a1 = new SceneObject(sphereGeometry, colorWhite);
			const atom_a2 = new SceneObject(sphereGeometry, colorWhite);
			const stick_a = new SceneObject(cylinderGeometry, colorBlue);

			const atom_b1 = new SceneObject(sphereGeometry, colorWhite);
			const atom_b2 = new SceneObject(sphereGeometry, colorWhite);
			const stick_b = new SceneObject(cylinderGeometry, colorBlue);

			const scene = new Scene([atom_a1, atom_a2, stick_a, atom_b1, atom_b2, stick_b]);
			scene.load(device);

			atom_a1.setPosition(vec3.create(0, 0, 0));
			atom_a2.setPosition(vec3.create(1, 1, 1));

			atom_b1.setPosition(vec3.create(3, 1, 0));
			atom_b2.setPosition(vec3.create(3, 0, 1));

			let connectAtoms = (stick, atom1, atom2) => {
				let diff = vec3.sub(atom2.position, atom1.position);
				let dist = vec3.length(diff);
				stick.scaleY(dist);

				let u1 = vec3.create(0, 1, 0);
				let u2 = vec3.divScalar(diff, dist);
				let dot_u1u2 = vec3.dot(u1, u2);
				let angle = Math.acos(dot_u1u2);
				let axis = vec3.cross(u1, u2);
				stick.setRotation((180 * angle) / Math.PI, axis);

				stick.translate(vec3.divScalar(vec3.add(atom1.position, atom2.position), 2));
			};

			connectAtoms(stick_a, atom_a1, atom_a2);
			connectAtoms(stick_b, atom_b1, atom_b2);

			/*
			let diff = vec3.sub(atom_a2.position, atom_a1.position);
			let dist = vec3.length(diff)
			console.log(diff);
			console.log(dist);
			stick_a.scaleY(1 / dist);
			//stick_a.rotateZ(90);

			let u1 = vec3.create(0, 1, 0);
			let u2 = vec3.divScalar(diff, dist);
			let dot_u1u2 = vec3.dot(u1, u2);
			let angle = Math.acos(dot_u1u2);
			let axis = vec3.cross(u1, u2);

			stick_a.setRotation(180 * angle / Math.PI, axis);

			stick_a.translate(vec3.create(0.5, 0, 0));
			*/

			/** Example Start */

			// Works
			//stick_a.rotateX(45);
			//stick_a.rotateZ(145);

			//stick_b.rotateX(45);
			//stick_b.rotateZ(145);
			//stick_b.setPosition(vec3.create(3, 0, 0));

			// Doesn't work
			//stick.rotateZ(145);
			//stick.rotateX(45);

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

				renderer.render(scene, { camera });
			});
		} catch (error) {
			alert(error);
		}
	});
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
