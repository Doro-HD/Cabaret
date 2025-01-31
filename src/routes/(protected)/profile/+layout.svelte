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
	<div>
		<div class="hidden h-full w-0 rounded border-2 p-2 shadow sm:block sm:w-36">
			{@render sidebarLinks()}
		</div>

		<div class="sm:hidden grid h-full place-items-center border-r-2 pe-2">
			<Sheet.Root>
				<Sheet.Trigger asChild let:builder>
					<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
						<ChevronRight></ChevronRight>
					</Button>
				</Sheet.Trigger>

				<Sheet.Content side="left" class="flex flex-col">
					{@render sidebarLinks()}
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>

	<div class="sm:pe-0 w-full pe-2">
		{@render children()}
	</div>
</div>
