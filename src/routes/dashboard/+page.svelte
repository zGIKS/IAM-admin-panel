<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import type { PageData } from "./$types";

	let { data } = $props<{ data: PageData }>();
</script>

<section class="space-y-6">
	<div class="space-y-2">
		<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Overview</p>
		<h1 class="text-3xl font-semibold tracking-tight">Dashboard</h1>
		<p class="text-sm text-muted-foreground">Overview of your admin workspace</p>
	</div>

	<Card class="border bg-card/80">
		<CardHeader>
			<CardDescription>Total projects</CardDescription>
			<CardTitle class="text-4xl tracking-tight">{data.totalProjects}</CardTitle>
		</CardHeader>
		<CardContent>
				<div class="rounded-xl border border-dashed bg-muted/40 p-4">
					<p class="text-sm text-muted-foreground">
						Active tenants in your platform. Use quick actions to create or manage projects.
					</p>
				</div>
		</CardContent>
	</Card>

	{#if data.loadError}
		<p class="text-sm text-destructive">{data.loadError}</p>
	{/if}

	<Card class="border bg-card/80">
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
