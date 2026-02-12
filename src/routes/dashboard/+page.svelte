<script lang="ts">
	import { Button } from "$lib/components/ui/button";
</script>

<main class="flex min-h-screen items-center justify-center bg-background px-6">
	<section class="w-full max-w-xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
		<h1 class="text-2xl font-semibold">Panel protegido</h1>
		<p class="mt-2 text-sm text-muted-foreground">
			El login fue exitoso y esta ruta solo se puede abrir con el token en la cookie de sesion.
		</p>

		<form method="POST" action="?/logout" class="mt-6">
			<Button type="submit" variant="outline">Cerrar sesion</Button>
		</form>
	</section>
</main>
