<script lang="ts">
	import { Button } from '$lib/shad/components/ui/button';
	import AuthForm from '../AuthForm.svelte';
</script>

<AuthForm formId="sign-in">
	{#snippet title()}
		Log in
	{/snippet}

	{#snippet footer()}
		<Button variant="link" href="/sign-up">Dont have an account?</Button>

		<Button form="sign-in" type="submit">Log in</Button>
	{/snippet}
</AuthForm>
