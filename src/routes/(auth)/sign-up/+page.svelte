<script lang="ts">
	import { Button } from '$lib/shad/components/ui/button';
	import AuthForm from '../AuthForm.svelte';
</script>

<AuthForm formId="sign-up">
	{#snippet title()}
		Sign up
	{/snippet}

	{#snippet footer()}
		<Button variant="link" href="/sign-in">Already have an account?</Button>

		<Button form="sign-up" type="submit">Sign up</Button>
	{/snippet}
</AuthForm>
