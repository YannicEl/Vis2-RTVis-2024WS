<script lang="ts">
	import { goto } from '$app/navigation';
	import { mergeClasses } from '$lib/utils';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { page } from '$app/stores';

	type Props = {} & SvelteHTMLElements['div'];
	let { class: className, ...props }: Props = $props();

	let example = $state<string | undefined>($page.route.id?.split('/')?.at(-1));
	function onExampleSelect() {
		if (example) goto(example);
	}
</script>

<div
	class={mergeClasses(
		className,
		'shadow-elevation-100 flex rounded-xl border border-gray-200 bg-white p-1'
	)}
	{...props}
>
	<label>
		<select name="examples" bind:value={example} onchange={onExampleSelect}>
			<option value="molecules">Molecules</option>
			<option value="ray-marching">Ray Marching</option>
		</select>
	</label>
</div>
