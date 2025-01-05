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
		max: 100,
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

	return {
		fov,
		near,
		far,
	};
}
