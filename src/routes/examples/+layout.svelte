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
	<FpsCounter class="absolute top-2 left-2" fps={globalState.fps} />
	<SideControls class="absolute top-4 right-4" />
	<BottomControls class="absolute right-0 bottom-4 left-0 mx-auto w-min" />

	{@render children()}
</main>
