<!--
@component
The basic form used for sign in and sign up
-->
<script lang="ts" module>
	export { field };
</script>

<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Card from '$lib/shad/components/ui/card';
	import { Input } from '$lib/shad/components/ui/input';
	import { Label } from '$lib/shad/components/ui/label';
	import type { Snippet } from 'svelte';

	type Props = {
		formId: string;
		title: Snippet;
		form?: Snippet;
		footer: Snippet;
	};
	const { formId, form, title, footer }: Props = $props();

	let email = $state('');
	let password = $state('');
</script>

{#snippet field(name: string, type: 'text' | 'password', label?: string)}
	<Label class="self-center">
		{#if label}
			{label}
		{:else}
			{name[0].toUpperCase() + name.slice(1)}:
		{/if}
	</Label>
	<Input class="col-span-3" {type} {name} />
{/snippet}

<Card.Root>
	<Card.Header>
		<Card.Title>
			{@render title()}
		</Card.Title>
	</Card.Header>

	<Card.Content>
		<form id={formId} method="POST" use:enhance>
			<div class="grid grid-cols-4 gap-2">
				{@render field('email', 'text')}

				{@render field('password', 'password')}

				{#if form}
					{@render form()}
				{/if}
			</div>
		</form>
	</Card.Content>

	<Card.Footer class="flex justify-end gap-x-2">
		{@render footer()}
	</Card.Footer>
</Card.Root>
