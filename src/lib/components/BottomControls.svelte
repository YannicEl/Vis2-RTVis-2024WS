<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { useFullscreen } from '$lib/fullscreen.svelte';
	import MdiFullscreen from '~icons/mdi/fullscreen';
	import MdiFullscreenExit from '~icons/mdi/fullscreen-exit';
	import MdiMinus from '~icons/mdi/minus';
	import MdiPlus from '~icons/mdi/plus';
	import { globalState } from '$lib/globalState.svelte';
	import GravityUiArrowUturnCcwRight from '~icons/gravity-ui/arrow-uturn-ccw-right';

	type Props = {} & SvelteHTMLElements['div'];
	let { class: className, ...props }: Props = $props();

	const fullscreen = useFullscreen(document.documentElement);

	function rotateLeft() {
		if (globalState.contols) {
			globalState.contols.input.x = -1;
		}
	}

	function rotateRight() {
		if (globalState.contols) {
			globalState.contols.input.x = 1;
		}
	}

	function zoomOut(): void {
		if (globalState.contols) {
			globalState.contols.input.zoom = 1;
		}
	}

	function zoomIn(): void {
		if (globalState.contols) {
			globalState.contols.input.zoom = -1;
		}
	}
</script>

<div class={[className, 'flex justify-between']} {...props}>
	<button onclick={rotateRight}>
		<GravityUiArrowUturnCcwRight class="rotate- text-xl" style="animation-play-state: paused;" />
	</button>

	<button onclick={zoomIn}>
		<MdiPlus class="text-2xl" />
	</button>

	<button onclick={zoomOut}>
		<MdiMinus class="text-2xl" />
	</button>

	<button onclick={rotateLeft}>
		<GravityUiArrowUturnCcwRight class="-scale-x-100 text-xl" />
	</button>

	<button onclick={fullscreen.toggle}>
		{#if fullscreen.value}
			<MdiFullscreenExit class="text-2xl" />
		{:else}
			<MdiFullscreen class="text-2xl" />
		{/if}
	</button>
</div>

<style>
	button {
		--apply: size-10 flex items-center justify-center;

		&:hover {
			--apply: bg-gray-1;
		}
	}
</style>
