import { onDestroy } from 'svelte';

export function useFullscreen(element: Element) {
	let isFullscreen = $state(false);

	function toggleFullscreen(): void {
		if (!document.fullscreenElement) {
			element.requestFullscreen();
		} else if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}

	function setIsFullscreen(): void {
		isFullscreen = !!document.fullscreenElement;
		console.log(isFullscreen);
	}

	element.addEventListener('fullscreenchange', setIsFullscreen);
	onDestroy(() => element.removeEventListener('fullscreenchange', setIsFullscreen));

	return {
		toggle: toggleFullscreen,
		get value() {
			return isFullscreen;
		},
	};
}
