<script lang="ts">
	import { Trash2 } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import type { PageData } from "./$types";

	let { data, form } = $props<{ data: PageData; form?: { error?: string } }>();
	let newestFirst = $state(true);

	const sortedProjects = $derived.by(() => {
		const tenants = [...data.tenants];
		return tenants.sort((a, b) => {
			return newestFirst ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
		});
	});

	const createdProjectsCount = $derived(data.tenants.length);
</script>

<section class="space-y-6">
	<Card>
		<CardHeader class="pb-4">
			<CardDescription>Total de proyectos creados</CardDescription>
			<CardTitle class="text-3xl">{createdProjectsCount}</CardTitle>
		</CardHeader>
		<CardContent class="flex flex-wrap items-center gap-3">
			<a
				href="/dashboard/projects/new"
				class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
			>
				Crear proyecto
			</a>
			<Button variant="outline" onclick={() => (newestFirst = !newestFirst)}>
				{newestFirst ? "Orden: Z-A" : "Orden: A-Z"}
			</Button>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Proyectos creados</CardTitle>
			<CardDescription>
				{sortedProjects.length} resultado{sortedProjects.length === 1 ? "" : "s"}
			</CardDescription>
		</CardHeader>
		<CardContent>
			{#if data.loadError}
				<p class="text-sm text-destructive">{data.loadError}</p>
			{/if}

			{#if form?.error}
				<p class="text-sm text-destructive">{form.error}</p>
			{/if}

			{#if sortedProjects.length === 0}
				<p class="text-sm text-muted-foreground">No hay proyectos para mostrar.</p>
			{:else}
				<ul class="space-y-2">
					{#each sortedProjects as project (project.id)}
						<li class="flex items-center justify-between rounded-lg border px-3 py-2">
							<div>
								<p class="text-sm font-medium">{project.name}</p>
								<p class="text-xs text-muted-foreground">
									Estado: {project.active ? "Activo" : "Inactivo"} · Estrategia: {project.db_strategy_type}
								</p>
							</div>
							<form method="POST" action="?/delete">
								<input type="hidden" name="id" value={project.id} />
								<Button
									type="submit"
									variant="ghost"
									size="icon"
									aria-label={`Borrar ${project.name}`}
								>
									<Trash2 class="size-4" />
								</Button>
							</form>
						</li>
					{/each}
				</ul>
			{/if}
		</CardContent>
	</Card>
</section>
