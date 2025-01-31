<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';
	import type { LayoutProps } from './$types.js';

	import '../app.css';
	import { Button } from '$lib/shad/components/ui/button';

	let { data, children }: LayoutProps = $props();
</script>

<div class="flex h-screen flex-col">
	<div class="sticky top-0 flex justify-between border-b-2 p-2 shadow">
		<a class="text-3xl font-bold" href="/">Carbaret</a>

		<div class="flex place-items-center gap-x-2">
			{#if data.isSignedIn}
				<form action="/sign-out" method="post" use:enhance>
					<Button variant="ghost" type="submit">Sign out</Button>
				</form>
			{:else}
				<Button variant="link" href="/sign-in">Log in</Button>

				<Button variant="link" href="/sign-up">Sign up</Button>
			{/if}
		</div>
	</div>

	<div class="flex-1 overflow-auto">
		{@render children()}
	</div>
</div>
