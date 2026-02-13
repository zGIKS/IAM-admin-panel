<script lang="ts">
	import { Button } from "$lib/components/ui/button";
</script>

<section class="max-w-md">
	<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>
	<h2 class="mt-1 text-2xl font-semibold tracking-tight">Settings</h2>
	<form method="POST" action="?/logout" class="mt-4">
		<Button type="submit" variant="outline">Sign out</Button>
	</form>
</section>
