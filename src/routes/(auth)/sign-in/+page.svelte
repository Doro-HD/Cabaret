<script lang="ts">
	import type { PageProps } from './$types';

	import { Button } from '$lib/shad/components/ui/button';
	import AuthForm, { formError } from '../AuthForm.svelte';

	const { form }: PageProps = $props();

	let formErrorMsg: string | undefined = $state(undefined);

	$effect(() => {
		if (!form) {
			return;
		}

		formErrorMsg = form.formError;
	});
</script>

<AuthForm formId="sign-in" errors={{ emailError: undefined, passwordError: undefined}}>
	{#snippet title()}
		Log in
	{/snippet}

	{#snippet form()}
		{#if formErrorMsg}
			{@render formError(formErrorMsg)}	
		{/if}
	{/snippet}

	{#snippet footer(isSubmitting)}
		<Button variant="link" href="/sign-up" aria-disabled={isSubmitting}
			>Dont have an account?</Button
		>

		<Button form="sign-in" type="submit" disabled={isSubmitting}>Log in</Button>
	{/snippet}
</AuthForm>
