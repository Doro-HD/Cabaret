<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<div class="grid h-full place-items-center px-2 sm:px-0">
	{@render children()}
</div>
