<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import type { PageData } from "./$types";

	let { data } = $props<{ data: PageData }>();
</script>

<section class="space-y-6">
	<Card>
		<CardHeader>
			<CardTitle>Dashboard</CardTitle>
			<CardDescription>Overview of your admin workspace</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="rounded-lg border p-4">
				<p class="text-xs text-muted-foreground">Total projects</p>
				<p class="mt-1 text-2xl font-semibold">{data.totalProjects}</p>
			</div>
		</CardContent>
	</Card>

	{#if data.loadError}
		<p class="text-sm text-destructive">{data.loadError}</p>
	{/if}

	<Card>
		<CardHeader>
			<CardTitle>Quick actions</CardTitle>
		</CardHeader>
		<CardContent class="flex flex-wrap items-center gap-3">
			<a href="/dashboard/projects/new">
				<Button type="button">Create project</Button>
			</a>
			<a href="/dashboard/projects">
				<Button type="button" variant="outline">Manage projects</Button>
			</a>
			<a href="/dashboard/settings">
				<Button type="button" variant="outline">Open settings</Button>
			</a>
		</CardContent>
	</Card>
</section>
