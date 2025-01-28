<!--
@component
The basic form used for sign in and sign up
-->

<script lang="ts">
	import * as Card from '$lib/shad/components/ui/card';
	import { Input } from '$lib/shad/components/ui/input';
	import { Label } from '$lib/shad/components/ui/label';
	import type { Snippet } from 'svelte';

	type Props = {
		formId: string;
		title: Snippet;
		footer: Snippet;
	};
	const { formId, title, footer }: Props = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>
			{@render title()}
		</Card.Title>
	</Card.Header>

	<Card.Content>
		<form id={formId} method="POST">
			<div class="grid grid-cols-4 gap-2">
				<Label class="self-center">Email:</Label>
				<Input class="col-span-3" type="text" name="email" />

				<Label class="self-center">Password:</Label>
				<Input class="col-span-3" type="password" name="password" />
			</div>
		</form>
	</Card.Content>

	<Card.Footer class="flex justify-end gap-x-2">
		{@render footer()}
	</Card.Footer>
</Card.Root>
