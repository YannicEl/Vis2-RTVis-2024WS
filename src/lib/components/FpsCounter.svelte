<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = { fps: number } & SvelteHTMLElements['div'];
	let { fps, ...props }: Props = $props();
</script>

<div {...props}>
	{fps.toFixed()} fps
</div>

<style>
	div {
		color: greenyellow;
		background: black;
		padding: 0.25rem;
		font-family: monospace;
	}
</style>
