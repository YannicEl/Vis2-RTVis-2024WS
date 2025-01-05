<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = { fps: number } & SvelteHTMLElements['div'];
	let { fps, ...props }: Props = $props();
</script>

<div {...props}>
	{fps.toFixed()} fps

	<svg class="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<circle cx="12" cy="12" r="10" />
	</svg>
</div>

<style>
	div {
		color: black;
		background: white;
		padding: 0.25rem;
		font-family: monospace;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: center;
	}

	circle {
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-dasharray: 70;
		stroke-dashoffset: 30;
		fill: transparent;
		animation: rotation 0.6s linear infinite;
		transform-origin: center;
	}

	@keyframes rotation {
		100% {
			transform: rotate(1turn);
		}
	}
</style>
