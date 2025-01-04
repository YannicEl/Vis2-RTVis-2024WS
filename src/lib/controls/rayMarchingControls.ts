import { getControls } from './controls.svelte';

export function setupRayMarchingControls() {
	const controls = getControls();

	const clearColor = controls.addControl({
		name: 'Clear color',
		type: 'color',
		value: '#ffffff',
	});

	const fragmentColor = controls.addControl({
		name: 'Fragment color',
		type: 'color',
		value: '#0000ff',
	});

	const numberOfSteps = controls.addControl({
		name: 'Number of steps',
		type: 'range',
		value: 300,
		min: 0,
		max: 5000,
	});

	const minimumHitDistance = controls.addControl({
		name: 'Minimum hit distance',
		type: 'range',
		value: 0.4,
		step: 0.01,
		min: 0,
		max: 1,
	});

	const maximumTraceDistance = controls.addControl({
		name: 'Maximum trace distance',
		type: 'range',
		value: 1000,
		min: 0,
		max: 5000,
	});

	const subsurfaceDepth = controls.addControl({
		name: 'Subsurface depth',
		type: 'range',
		value: 2,
		step: 0.01,
		min: 0,
		max: 5,
	});

	return {
		clearColor,
		fragmentColor,
		numberOfSteps,
		minimumHitDistance,
		maximumTraceDistance,
		subsurfaceDepth,
	};
}
