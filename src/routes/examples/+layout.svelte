<script lang="ts">
	import BottomControls from '$lib/components/BottomControls.svelte';
	import FpsCounter from '$lib/components/FpsCounter.svelte';
	import SideControls from '$lib/components/SideControls.svelte';
	import { globalState } from '$lib/globalState.svelte';
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();
</script>

<main class="relative h-screen w-screen">
	{#if globalState.showFps}
		<FpsCounter class="absolute left-0 top-0" fps={globalState.fps} />
	{/if}
	<SideControls class="absolute right-0 top-0" />
	{@render children()}
</main>
