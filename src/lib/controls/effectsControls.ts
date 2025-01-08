import type { RayMarchingMaterial } from '$lib/webGPU/material/RayMarchingMaterial';
import { getControls } from './controls.svelte';

export function addEffectsControls(material: RayMarchingMaterial) {
	const controls = getControls();

	let group = 'Subsurface scattering';
	const subsurfaceScattering = controls.addControl({
		name: 'Enable',
		group,
		type: 'checkbox',
		value: true,
	});
	subsurfaceScattering.onChange((subsurfaceScattering) =>
		material.updateBufferValues({ subsurfaceScattering: subsurfaceScattering ? 1 : 0 })
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

	group = 'Transparency';
	const transparency = controls.addControl({
		name: 'Enable',
		group,
		type: 'checkbox',
		value: true,
	});
	transparency.onChange((transparency) =>
		material.updateBufferValues({ transparency: transparency ? 1 : 0 })
	);

	const maximumTransparencyDepth = controls.addControl({
		name: 'Maximum transparency depth',
		group,
		type: 'range',
		value: 0.2,
		min: 0,
		max: 1,
		step: 0.01,
	});
	maximumTransparencyDepth.onChange((maximumTransparencyDepth) =>
		material.updateBufferValues({ maximumTransparencyDepth })
	);

	group = 'Reflection';
	const reflections = controls.addControl({
		name: 'Enable',
		group,
		type: 'checkbox',
		value: true,
	});
	reflections.onChange((reflections) =>
		material.updateBufferValues({ reflections: reflections ? 1 : 0 })
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
		subsurfaceScattering,
		subsurfaceDepth,

		transparency,
		maximumTransparencyDepth,

		reflections,
		reflectionFactor,
	};
}
