import { getCameraContext } from '$lib/cameraControls.svelte';
import { vec3 } from 'wgpu-matrix';

let isRotating = $state(false);
let rotation = 0;

export const useRotatingCamera = () => {
	const camera = getCameraContext();
	const toggleRotating = () => {
		isRotating = !isRotating;
	};

	const rotateCamera = (deltaTime: number) => {
		if (isRotating) {
			rotation += 0.01 * deltaTime;
			console.log(rotation, Math.cos(rotation), Math.sin(rotation));

			camera.position = vec3.add(
				camera.position,
				vec3.create(Math.cos(rotation) * 0.1, 0, Math.sin(rotation) * 0.1)
			);

			// todo: look at center of scene
		}
	};

	return {
		toggle: toggleRotating,
		rotateCamera,
	};
};
