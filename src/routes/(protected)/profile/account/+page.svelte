<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/shad/components/ui/button';
	import { Input } from '$lib/shad/components/ui/input';
	import { Label } from '$lib/shad/components/ui/label';

	const { data, form }: PageProps = $props();

	const user = $derived(data.user);

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

<div class="w-full">
	<div class="border-b-2 pb-2">
		<h1 class="text-xl font-bold">Email:</h1>

		<form method="post" class="space-y-2" use:enhance>
			<div class="flex place-items-center gap-x-2">
				<Label>New Email</Label>
				<Input type="text" name="email" class="w-72" value={user.email} />
			</div>

			<Button type="submit">Save new Email</Button>
		</form>
	</div>

	<div class="border-b-2 pb-2">
		<h1 class="text-xl font-bold">Username:</h1>
		<p>
			You can set a username if you so desire, it will be used exclusively for displaying how you
			choose to identify
		</p>

		<form method="post" class="space-y-2" use:enhance>
			<div class="flex place-items-center gap-x-2">
				<Label>New Username</Label>
				<Input type="text" name="username" class="w-72" value={user.username} />
			</div>

			<Button type="submit">Save new Username</Button>
		</form>
	</div>

	<div class="border-b-2 pb-2">
		<h1 class="text-xl font-bold">Password:</h1>

		<form method="post" class="space-y-2">
			<div class="flex place-items-center gap-x-2">
				<Label>New Password</Label>
				<Input type="password" name="password" class="w-72" />
			</div>

			<Button>Save new Password</Button>
		</form>
	</div>
</div>
