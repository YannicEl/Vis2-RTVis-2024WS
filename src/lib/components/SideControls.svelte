<script lang="ts">
	import { mergeClasses } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { page } from '$app/stores';
	import { getSettings } from '$lib/settings.svelte';
	import { goto } from '$app/navigation';

	type Props = {} & SvelteHTMLElements['div'];
	let { class: className, ...props }: Props = $props();

	const settings = getSettings();

	const exampleControl = settings.addControl({
		name: 'Example',
		type: 'select',
		value: $page.route.id?.split('/')?.at(-1) ?? '/',
		options: [
			{ label: 'Molecules', value: 'molecules' },
			{ label: 'Ray marching', value: 'ray-marching' },
			{ label: 'Rotation', value: 'rotation' },
			{ label: 'Compute', value: 'compute' },
			{ label: 'Three.js', value: 'three' },
		],
	});

	exampleControl.onChange((example) => goto(example));
</script>

<div
	class={mergeClasses(
		className,
		'shadow-elevation-100 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-1'
	)}
	{...props}
>
	{#each settings.controls as control (control)}
		<label>
			{#if control.type !== 'button'}
				{control.name}
			{/if}
			{#if control.type === 'select'}
				<select name="examples" bind:value={control.value}>
					{#each control.options as option (option)}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			{:else if control.type === 'number'}
				<input
					type={control.type}
					name={control.name}
					bind:value={control.value}
					min={control.min}
					max={control.max}
					step={control.step}
				/>
			{:else if control.type === 'range'}
				<input
					type={control.type}
					name={control.name}
					bind:value={control.value}
					min={control.min}
					max={control.max}
					step={control.step}
				/>

				<input
					type="number"
					bind:value={control.value}
					min={control.min}
					max={control.max}
					step={control.step}
				/>
			{:else if control.type === 'text'}
				<input type={control.type} name={control.name} bind:value={control.value} />
			{:else if control.type === 'button'}
				<button
					type={control.type}
					name={control.name}
					onclick={control.onClick}
					class="rounded border border-gray-200 bg-white py-1 px-2"
				>
					{control.label}
				</button>
			{/if}
		</label>
	{/each}
</div>
