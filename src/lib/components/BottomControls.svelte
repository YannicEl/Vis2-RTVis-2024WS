<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import SvelteLogo from 'virtual:icons/logos/svelte-icon';

	type Props = {} & SvelteHTMLElements['div'];
	let { ...props }: Props = $props();
</script>

<div {...props}>
	<button>
		<SvelteLogo class="mt-2" style="font-size:2em" />
	</button>
</div>
