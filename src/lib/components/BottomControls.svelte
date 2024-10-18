<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { mergeClasses } from '../utils';
	import { useFullscreen } from '$lib/fullscreen.svelte';
	import { useRotatingCamera } from '$lib/rotatingCamera.svelte';
	import IconFullscreen from '~icons/material-symbols/fullscreen';
	import IconFullscreenExit from '~icons/material-symbols/fullscreen-exit';
	import IconsAdd from '~icons/material-symbols/add';
	import IconMinus from '~icons/material-symbols/remove';
	import IconRotateRight from '~icons/material-symbols/rotate-right';
	import { getCameraContext } from '$lib/cameraControls.svelte';
	import { vec3 } from 'wgpu-matrix';

	type Props = {} & SvelteHTMLElements['div'];
	let { class: className, ...props }: Props = $props();

	const camera = getCameraContext();

	const fullscreen = useFullscreen(document.documentElement);

	function zoomOut(): void {
		camera.position = vec3.add(camera.position, vec3.create(0, 0, 0.5));
	}

	function zoomIn(): void {
		camera.position = vec3.add(camera.position, vec3.create(0, 0, -0.5));
	}

	const rotate = useRotatingCamera();
</script>

<div
	class={mergeClasses(
		className,
		'shadow-elevation-100 flex rounded-xl border border-gray-200 bg-white p-1'
	)}
	{...props}
>
	<button onclick={zoomIn}>
		<IconsAdd class="text-2xl text-gray-500" />
	</button>

	<button onclick={zoomOut}>
		<IconMinus class="text-2xl text-gray-500" />
	</button>

	<button onclick={rotate.toggle}>
		<IconRotateRight class="text-2xl text-gray-500" />
	</button>

	<button onclick={fullscreen.toggle}>
		{#if fullscreen.value}
			<IconFullscreenExit class="text-2xl text-gray-500" />
		{:else}
			<IconFullscreen class="text-2xl text-gray-500" />
		{/if}
	</button>
</div>

<style lang="scss">
	button {
		border-radius: var(--radius-xl);
		padding: var(--spacing-2);

		&:hover {
			background-color: var(--color-gray-100);
		}
	}
</style>
