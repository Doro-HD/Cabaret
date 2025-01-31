<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	import { Button } from '$lib/shad/components/ui/button/';
	import { Toaster } from '$lib/shad/components/ui/sonner';
	import type { Snippet } from 'svelte';
	import * as Sheet from '$lib/shad/components/ui/sheet';

	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<Toaster></Toaster>

{#snippet sidebarLinks()}
	<Button variant="link" href="/profile/account">Account</Button>
	<Button variant="link" href="/profile/projects">Projects (WIP)</Button>
{/snippet}

<div class="flex h-full gap-x-2">
	<div class="h-full flex place-items-center">
		<div class='h-full hidden sm:block w-0 sm:w-36 rounded border-2 p-2 shadow'>
			{@render sidebarLinks()}
		</div>

		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]} size='icon' class='sm:hidden'>
					<ChevronRight></ChevronRight>
				</Button>
			</Sheet.Trigger>

			<Sheet.Content side='left' class='flex flex-col'>
				{@render sidebarLinks()}
			</Sheet.Content>
		</Sheet.Root>
	</div>

	<div class="w-full">
		{@render children()}
	</div>
</div>
