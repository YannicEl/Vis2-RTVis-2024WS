<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Slider } from 'bits-ui';
	import type { WithoutChildren } from 'bits-ui';

	type Props = Omit<WithoutChildren<ComponentProps<typeof Slider.Root>>, 'type'>;

	let { value = $bindable(), ...restProps }: Props = $props();
</script>

<Slider.Root
	bind:value
	type="single"
	{...restProps as any}
	class="relative flex w-full touch-none items-center select-none"
>
	{#snippet children({ thumbs })}
		<span class="relative h-2 w-full grow cursor-pointer overflow-hidden bg-gray-200">
			<Slider.Range class="absolute h-full bg-black" />
		</span>
		{#each thumbs as index}
			<Slider.Thumb {index} />
		{/each}
	{/snippet}
</Slider.Root>
