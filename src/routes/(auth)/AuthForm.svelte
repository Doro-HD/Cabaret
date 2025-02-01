<!--
@component
The basic form used for sign in and sign up
-->
<script lang="ts" module>
	export { formField, formError };
</script>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';

	import * as Card from '$lib/shad/components/ui/card';
	import { Input } from '$lib/shad/components/ui/input';
	import { Label } from '$lib/shad/components/ui/label';
	import type { Snippet } from 'svelte';

	type Props = {
		formId: string;
		errors?: {
			emailError: string | undefined;
			passwordError: string | undefined;
		};
		title: Snippet;
		form?: Snippet;
		footer: Snippet<[boolean]>;
	};
	const { formId, errors, form, title, footer }: Props = $props();

	let isSubmitting = $state(false);
</script>

{#snippet formField(name: string, type: 'text' | 'password', label?: string)}
	<Label class="self-center">
		{#if label}
			{label}
		{:else}
			{name[0].toUpperCase() + name.slice(1)}:
		{/if}
	</Label>
	<Input class="col-span-3" {type} {name} />
{/snippet}

{#snippet formError(msg: string)}
	<p class='col-span-4 text-red-500 text-xs' transition:slide={{ delay: 50 }}>{msg}</p>	
{/snippet}

<Card.Root class="w-full sm:w-80">
	<Card.Header>
		<Card.Title>
			{@render title()}
		</Card.Title>
	</Card.Header>

	<Card.Content>
		<form
			id={formId}
			method="POST"
			use:enhance={() => {
				isSubmitting = true;

				return ({ update }) => {
					isSubmitting = false;

					update();
				}
			}}
		>
			<div class="grid grid-cols-4 gap-2">
				{@render formField('email', 'text')}
				{#if errors.emailError}
					{@render formError(errors.emailError)}	
				{/if}

				{@render formField('password', 'password')}
				{#if errors.passwordError}
					{@render formError(errors.passwordError)}	
				{/if}

				{#if form}
					{@render form()}
				{/if}
			</div>
		</form>
	</Card.Content>

	<Card.Footer class="flex justify-between gap-x-2">
		{@render footer(isSubmitting)}
	</Card.Footer>
</Card.Root>
