import { goto } from '$app/navigation';
import { globalState } from '$lib/globalState.svelte';
import { getControls } from './controls.svelte';

export function addMiscControls() {
	const controls = getControls();
	const group = 'Misc';

	const showFps = controls.addControl({
		name: 'Show Fps',
		group,
		type: 'checkbox',
		value: true,
	});
	showFps.onChange((value) => (globalState.showFps = value));

	const backToLandingPage = controls.addControl({
		name: 'backToLandingPage',
		group,
		type: 'button',
		label: 'Back to landing page',
		value: false,
		onClick: () => goto('/'),
	});

	return { showFps, backToLandingPage };
}
