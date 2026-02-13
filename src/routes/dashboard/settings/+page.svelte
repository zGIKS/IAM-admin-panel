<script lang="ts">
	import { Button } from "$lib/components/ui/button";
</script>

<section class="max-w-md">
	<h2 class="text-base font-semibold">Settings</h2>
	<form method="POST" action="?/logout" class="mt-4">
		<Button type="submit" variant="outline">Sign out</Button>
	</form>
</section>
