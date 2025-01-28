<script lang="ts">
	import { Button } from '$lib/shad/components/ui/button';
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex justify-between border-b-2 px-2">
	<a class="text-3xl font-bold" href="/">Carbaret</a>

	<div class="flex place-items-center gap-x-2">
		<Button variant="link" href="/sign-in">Log in</Button>

		<Button variant="link" href="/sign-up">Sign up</Button>
	</div>
</div>

{@render children()}
