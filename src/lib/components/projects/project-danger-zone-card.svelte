<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
</script>

<Card class="border bg-destructive/5">
	<CardHeader>
		<CardTitle>Danger zone</CardTitle>
		<CardDescription>Permanently delete this project</CardDescription>
	</CardHeader>
	<CardContent>
		<form method="POST" action="?/delete">
			<Button type="submit" variant="destructive">Delete project</Button>
		</form>
	</CardContent>
</Card>
