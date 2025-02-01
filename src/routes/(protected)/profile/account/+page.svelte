<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { type Snippet } from 'svelte';
	import type { PageProps } from './$types';

	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/shad/components/ui/button';
	import { Input } from '$lib/shad/components/ui/input';
	import { Label } from '$lib/shad/components/ui/label';

	const { data, form }: PageProps = $props();

	const user = $derived(data.user);
	
	let isSubmitting = $state(false);

	const enhancer: SubmitFunction = () => {
		isSubmitting = true;

		return ({ update }) => {
			isSubmitting = false;

			update();
		}
	}

	$effect(() => {
		if (!form) {
			return;
		}

		const toastType = form?.message.type;
		const toastMessage = form?.message.content;

		switch (toastType) {
			case 'success':
				toast.success(toastMessage);
				break;
			case 'error':
				toast.error(toastMessage);
				break;
		}
	});
</script>

{#snippet section(field: Snippet, submitButtonText: string)}
	<div class="border-b-2 pb-2">
		<h1 class="text-xl font-bold">Email:</h1>

		<form method="post" class="space-y-2" use:enhance={enhancer}>
			<div class="flex place-items-center gap-x-2">
				{@render field()}
			</div>

			<Button type="submit" disabled={isSubmitting}>{submitButtonText}</Button>
		</form>
	</div>
{/snippet}

<div class="w-full">
	{#snippet emailField()}
		<Label>New Email</Label>
		<Input type="text" name="email" class="sm:w-72" value={user.email} disabled={isSubmitting} />
	{/snippet}

	{@render section(emailField, 'Save new Email')}


	{#snippet usernameField()}
		<Label>New Username</Label>
		<Input type="text" name="username" class="sm:w-72" value={user.username} disabled={isSubmitting} />
	{/snippet}

	{@render section(usernameField, 'Save new Username')}


	{#snippet passwordField()}
		<Label>New Password</Label>
		<Input type="password" name="password" class="sm:w-72" disabled={isSubmitting} />
	{/snippet}
	
	{@render section(passwordField, 'Save new Password')}

</div>
