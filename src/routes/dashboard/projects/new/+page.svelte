<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	let { form } = $props();
</script>

<section class="w-full">
	<Card>
		<CardHeader>
			<CardTitle>Create project</CardTitle>
			<CardDescription>Enter a name to create a new project.</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="POST" class="space-y-4">
				<div class="space-y-2">
					<Label for="name">Project name</Label>
					<Input id="name" name="name" type="text" required />
				</div>

				{#if form?.error}
					<p class="text-sm text-destructive">{form.error}</p>
				{/if}

				<div class="flex items-center gap-3">
					<Button type="submit">Create</Button>
					<a href="/dashboard/projects" class="text-sm text-muted-foreground hover:underline">Cancel</a>
				</div>
			</form>
		</CardContent>
	</Card>
</section>
