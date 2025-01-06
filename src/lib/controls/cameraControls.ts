import { globalState } from '$lib/globalState.svelte';
import type { Camera } from '$lib/webGPU/Camera';
import { getControls } from './controls.svelte';

export function addCameraControls(camera: Camera) {
	const controls = getControls();
	const group = 'Camera';

	const fov = controls.addControl({
		name: 'Field of view',
		group,
		type: 'range',
		value: camera.fov,
		min: 0,
		max: 180,
	});
	fov.onChange((fov) => (camera.fov = fov));

	const near = controls.addControl({
		name: 'Near',
		group,
		type: 'range',
		value: camera.near,
		min: 0,
		max: 1,
		step: 0.01,
	});
	near.onChange((near) => (camera.near = near));

	const far = controls.addControl({
		name: 'Far',
		group,
		type: 'range',
		value: camera.far,
		min: 0,
		max: 10000,
	});
	far.onChange((far) => (camera.far = far));

	const frictionCoefficient = controls.addControl({
		name: 'Friction coefficient',
		group,
		type: 'range',
		value: 0.01,
		min: 0,
		max: 0.1,
		step: 0.001,
	});
	frictionCoefficient.onChange((frictionCoefficient) => {
		if (!globalState.contols) return;
		globalState.contols.frictionCoefficient = frictionCoefficient;
	});

	const distance = controls.addControl({
		name: 'Distance',
		group,
		type: 'range',
		value: 80,
		min: 0,
		max: 400,
	});
	distance.onChange((distance) => {
		if (!globalState.contols) return;
		globalState.contols.distance = distance;
	});

	return {
		fov,
		near,
		far,
		frictionCoefficient,
		distance,
	};
}
