<script lang="ts">
	import { Trash2 } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";

	type Project = {
		id: number;
		name: string;
		createdAt: Date;
	};

	let projects = $state<Project[]>([
		{ id: 1, name: "IAM Migration", createdAt: new Date("2026-02-08") },
		{ id: 2, name: "Admin Panel", createdAt: new Date("2026-02-10") },
		{ id: 3, name: "Legacy Cleanup", createdAt: new Date("2026-02-04") }
	]);

	let newestFirst = $state(true);

	const sortedProjects = $derived.by(() => {
		return [...projects].sort((a, b) => {
			const diff = a.createdAt.getTime() - b.createdAt.getTime();
			return newestFirst ? -diff : diff;
		});
	});

	const createdProjectsCount = $derived(projects.length);

	function deleteProject(id: number) {
		projects = projects.filter((project) => project.id !== id);
	}

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat("es-AR", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		}).format(date);
	}
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
				{newestFirst ? "Orden: mas nuevos" : "Orden: mas antiguos"}
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
			{#if sortedProjects.length === 0}
				<p class="text-sm text-muted-foreground">No hay proyectos para mostrar.</p>
			{:else}
				<ul class="space-y-2">
					{#each sortedProjects as project (project.id)}
						<li class="flex items-center justify-between rounded-lg border px-3 py-2">
							<div>
								<p class="text-sm font-medium">{project.name}</p>
								<p class="text-xs text-muted-foreground">Creado: {formatDate(project.createdAt)}</p>
							</div>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onclick={() => deleteProject(project.id)}
								aria-label={`Borrar ${project.name}`}
							>
								<Trash2 class="size-4" />
							</Button>
						</li>
					{/each}
				</ul>
			{/if}
		</CardContent>
	</Card>
</section>
