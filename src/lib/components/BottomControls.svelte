<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { useFullscreen } from '$lib/fullscreen.svelte';
	import IconFullscreen from '~icons/material-symbols/fullscreen';
	import IconFullscreenExit from '~icons/material-symbols/fullscreen-exit';
	import IconsAdd from '~icons/material-symbols/add';
	import IconMinus from '~icons/material-symbols/remove';
	import { globalState } from '$lib/globalState.svelte';

	type Props = {} & SvelteHTMLElements['div'];
	let { class: className, ...props }: Props = $props();

	const fullscreen = useFullscreen(document.documentElement);

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

<div
	class={[className, 'shadow-elevation-100 flex rounded-xl border border-gray-200 bg-white p-1']}
	{...props}
>
	<button onclick={zoomIn}>
		<IconsAdd class="text-2xl text-gray-500" />
	</button>

	<button onclick={zoomOut}>
		<IconMinus class="text-2xl text-gray-500" />
	</button>

	<button onclick={fullscreen.toggle}>
		{#if fullscreen.value}
			<IconFullscreenExit class="text-2xl text-gray-500" />
		{:else}
			<IconFullscreen class="text-2xl text-gray-500" />
		{/if}
	</button>
</div>

<style>
	button {
		border-radius: var(--radius-xl);
		padding: var(--spacing-2);

		&:hover {
			background-color: var(--color-gray-100);
		}
	}
</style>
