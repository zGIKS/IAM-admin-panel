<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	let { form } = $props();
</script>

<section class="mx-auto w-full max-w-lg">
	<Card>
		<CardHeader>
			<CardTitle>Crear proyecto</CardTitle>
			<CardDescription>Ingresa el nombre para crear un nuevo proyecto.</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="POST" class="space-y-4">
				<div class="space-y-2">
					<Label for="name">Nombre del proyecto</Label>
					<Input id="name" name="name" type="text" required />
				</div>

				{#if form?.error}
					<p class="text-sm text-destructive">{form.error}</p>
				{/if}

				<div class="flex items-center gap-3">
					<Button type="submit">Crear</Button>
					<a href="/dashboard/projects" class="text-sm text-muted-foreground hover:underline">Cancelar</a>
				</div>
			</form>
		</CardContent>
	</Card>
</section>
