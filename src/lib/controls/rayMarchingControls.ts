import type { RayMarchingMaterial } from '$lib/webGPU/material/RayMarchingMaterial';
import { getControls } from './controls.svelte';

export function addRayMarchingControls(material: RayMarchingMaterial) {
	const controls = getControls();
	const group = 'Ray Marching';

	const clearColor = controls.addControl({
		name: 'Clear color',
		group,
		type: 'color',
		value: '#ffffff',
	});
	clearColor.onChange((clearColor) => material.updateBufferValues({ clearColor }));

	const fragmentColor = controls.addControl({
		name: 'Fragment color',
		group,
		type: 'color',
		value: '#0000ff',
	});
	fragmentColor.onChange((fragmentColor) => material.updateBufferValues({ fragmentColor }));

	const numberOfSteps = controls.addControl({
		name: 'Number of steps',
		group,
		type: 'range',
		value: 500,
		min: 0,
		max: 5000,
	});
	numberOfSteps.onChange((numberOfSteps) => material.updateBufferValues({ numberOfSteps }));

	const minimumHitDistance = controls.addControl({
		name: 'Minimum hit distance',
		group,
		type: 'range',
		value: 0.4,
		step: 0.01,
		min: 0,
		max: 1,
	});
	minimumHitDistance.onChange((minimumHitDistance) =>
		material.updateBufferValues({ minimumHitDistance })
	);

	const maximumTraceDistance = controls.addControl({
		name: 'Maximum trace distance',
		group,
		type: 'range',
		value: 1000,
		min: 0,
		max: 5000,
	});
	maximumTraceDistance.onChange((maximumTraceDistance) =>
		material.updateBufferValues({ maximumTraceDistance })
	);

	const subsurfaceDepth = controls.addControl({
		name: 'Subsurface depth',
		group,
		type: 'range',
		value: 4,
		step: 0.1,
		min: 0,
		max: 50,
	});
	subsurfaceDepth.onChange((subsurfaceDepth) => material.updateBufferValues({ subsurfaceDepth }));

	const maximumTransparencyDepth = controls.addControl({
		name: 'Maximum transparency depth',
		group,
		type: 'range',
		value: 0.3,
		min: 0,
		max: 1,
		step: 0.01,
	});
	maximumTransparencyDepth.onChange((maximumTransparencyDepth) =>
		material.updateBufferValues({ maximumTransparencyDepth })
	);

	const reflectionFactor = controls.addControl({
		name: 'Reflection factor',
		group,
		type: 'range',
		value: 0.05,
		min: 0,
		max: 1,
		step: 0.01,
	});
	reflectionFactor.onChange((reflectionFactor) =>
		material.updateBufferValues({ reflectionFactor })
	);

	return {
		clearColor,
		fragmentColor,
		numberOfSteps,
		minimumHitDistance,
		maximumTraceDistance,
		subsurfaceDepth,
	};
}
