<script lang="ts">
	import Button from '$lib/shad/components/ui/button/button.svelte';
	import { Toaster } from '$lib/shad/components/ui/sonner';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<Toaster></Toaster>

<div class="flex h-full gap-x-2">
	<div class="h-full hidden w-0 sm:w-36 rounded border-2 p-2 shadow">
		<Button variant="link" href="/profile/account">Account</Button>
		<Button variant="link" href="/profile/projects">Projects (WIP)</Button>
	</div>

	<div class="w-full">
		{@render children()}
	</div>
</div>
