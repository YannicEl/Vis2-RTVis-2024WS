<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { page } from '$app/state';
	import { getControls } from '$lib/controls/controls.svelte';
	import type { ControlParams } from '$lib/controls/controls.svelte';
	import { goto } from '$app/navigation';
	import MdiChevronDown from '~icons/mdi/chevron-down';
	import MdiChevronUp from '~icons/mdi/chevron-up';
	import MdiChevronDoubleRight from '~icons/mdi/chevron-double-right';
	import MdiChevronDoubleLeft from '~icons/mdi/chevron-double-left';

	type Props = {} & SvelteHTMLElements['div'];
	let { class: className, ...props }: Props = $props();

	const controls = getControls();

	const exampleControl = controls.addControl({
		name: 'Example',
		type: 'select',
		value: page.route.id?.split('/')?.at(-1) ?? '/',
		options: [
			{ label: 'Molecules', value: 'molecules' },
			{ label: 'Ray marching', value: 'ray-marching' },
			{ label: 'Rotation', value: 'rotation' },
			{ label: 'Blending', value: 'blending' },
			{ label: 'Instancing', value: 'instancing' },
		],
	});

	let showControls = $state(true);
	let controlsGrouped = $state<GroupdControls>([]);

	$effect(() => {
		controlsGrouped = groupControls(controls.controls);
	});

	type GroupdControls = { name: string; collapsed: boolean; controls: ControlParams[] }[];
	function groupControls(controls: ControlParams[]) {
		const groups: GroupdControls = [];

		controls.forEach((control) => {
			const found = groups.find((group) => group.name === (control.group ?? 'General'));
			if (found) {
				found.controls.push(control);
			} else {
				groups.push({
					name: control.group ?? 'General',
					collapsed: control.group ? true : false,
					controls: [control],
				});
			}
		});

		return groups;
	}

	exampleControl.onChange((example) => goto(example));
</script>

<div {...props} class={[className, 'max-h-full w-[300px] overflow-auto']}>
	{#if showControls}
		<div class="flex flex-col gap-4 border-b border-l border-gray-200 bg-white p-2">
			<div class="flex items-center justify-between">
				<h2>Controls</h2>

				<button
					class="flex items-center justify-center gap-1"
					onclick={() => (showControls = false)}
				>
					<span class="pt-0.5 text-sm">hide</span>
					<MdiChevronDoubleRight />
				</button>
			</div>

			{#each controlsGrouped as group (group.name)}
				<hr class="-m-2" />

				<button
					class="flex items-center justify-between"
					onclick={() => (group.collapsed = !group.collapsed)}
				>
					{group.name}
					{#if group.collapsed}
						<MdiChevronUp />
					{:else}
						<MdiChevronDown />
					{/if}
				</button>
				{#if !group.collapsed}
					{#each group.controls as control (control.name)}
						<label class="flex flex-col">
							{#if control.type !== 'button'}
								<span class="ml-2 text-sm">{control.name}</span>
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
								<div class="flex gap-2">
									<input
										type={control.type}
										name={control.name}
										bind:value={control.value}
										min={control.min}
										max={control.max}
										step={control.step}
										class="w-full"
									/>

									<input
										type="number"
										bind:value={control.value}
										min={control.min}
										max={control.max}
										step={control.step}
									/>
								</div>
							{:else if control.type === 'button'}
								<button
									type={control.type}
									name={control.name}
									onclick={control.onClick}
									class="rounded border border-gray-200 bg-white px-2 py-1"
								>
									{control.label}
								</button>
							{:else if control.type === 'checkbox'}
								<input type="checkbox" name={control.name} bind:checked={control.value} />
							{:else}
								<input type={control.type} name={control.name} bind:value={control.value} />
							{/if}
						</label>
					{/each}
				{/if}
			{/each}
		</div>
	{:else}
		<button
			class="flex items-center gap-1 justify-self-end p-2"
			onclick={() => (showControls = true)}
		>
			<MdiChevronDoubleLeft />
			<span class="leading-1.75rem pt-0.5 text-sm">show controls</span>
		</button>
	{/if}
</div>
