import { globalState } from '$lib/globalState.svelte';
import { getControls } from './controls.svelte';

export function addMiscControls() {
	const controls = getControls();
	const group = 'Misc';

	const showFps = controls.addControl({
		group,
		name: 'Show Fps',
		type: 'checkbox',
		value: true,
	});
	showFps.onChange((value) => (globalState.showFps = value));

	return { showFps };
}
