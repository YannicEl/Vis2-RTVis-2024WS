import type { RayMarchingMaterial } from '$lib/webGPU/material/RayMarchingMaterial';
import { getControls } from './controls.svelte';

export function addEffectsControls(material: RayMarchingMaterial) {
	const controls = getControls();
	const group = 'Effects';

	const subsurfaceScattering = controls.addControl({
		name: 'Subsurface scattering',
		group,
		type: 'checkbox',
		value: true,
	});
	subsurfaceScattering.onChange((subsurfaceScattering) =>
		material.updateBufferValues({ subsurfaceScattering: subsurfaceScattering ? 1 : 0 })
	);

	const transparency = controls.addControl({
		name: 'Transparency',
		group,
		type: 'checkbox',
		value: true,
	});
	transparency.onChange((transparency) =>
		material.updateBufferValues({ transparency: transparency ? 1 : 0 })
	);
}
