<script lang="ts">
	import { setCameraContext } from '$lib/cameraControls.svelte';
	import BottomControls from '$lib/components/BottomControls.svelte';
	import SideControls from '$lib/components/SideControls.svelte';
	import { Camera } from '$lib/webGPU/Camera';
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	const camera = new Camera();
	setCameraContext(camera);
</script>

<main class="relative h-screen w-screen">
	<SideControls class="absolute top-4 right-4" />
	<BottomControls class="absolute right-0 bottom-4 left-0 mx-auto w-min" />

	{@render children()}
</main>
