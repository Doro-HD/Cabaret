<script lang="ts">
	import { Button } from '$lib/shad/components/ui/button';
	import AuthForm, { formField, formError } from '../AuthForm.svelte';
	import type { PageProps } from './$types';

	const { form }: PageProps = $props();

	let emailErrorMsg: string | undefined = $state(undefined);
	let passwordErrorMsg: string | undefined = $state(undefined);
	let confirmPasswordErrorMsg: string | undefined = $state(undefined);

	$effect(() => {
		if (!form) {
			return;
		}

		const { emailError, passwordError, confirmPasswordError } = form.formErrors;

		emailErrorMsg = emailError;
		passwordErrorMsg = passwordError;
		confirmPasswordErrorMsg = confirmPasswordError;

	});
</script>

<AuthForm formId="sign-up" errors={{ emailError: emailErrorMsg, passwordError: passwordErrorMsg }}>
	{#snippet title()}
		Sign up
	{/snippet}

	{#snippet form()}
		{@render formField('confirm-password', 'password', 'Confirm password')}
		{#if confirmPasswordErrorMsg}
			{@render formError(confirmPasswordErrorMsg)}
		{/if}
	{/snippet}

	{#snippet footer(isSubmitting)}
		<Button variant="link" href="/sign-in" aria-disabled={isSubmitting}
			>Already have an account?</Button
		>

		<Button form="sign-up" type="submit" disabled={isSubmitting}>Sign up</Button>
	{/snippet}
</AuthForm>
