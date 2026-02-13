<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	let { form } = $props();
</script>

<main class="flex min-h-screen items-center justify-center bg-background px-6">
	<Card class="w-full max-w-sm border bg-card/85 shadow-sm backdrop-blur-sm">
		<CardHeader class="text-center">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">IAM Admin</p>
			<CardTitle class="mt-1 text-2xl tracking-tight">Login</CardTitle>
		</CardHeader>
		<CardContent>
			<form method="POST" class="space-y-4">
				<div class="space-y-2">
					<Label for="username">Username</Label>
					<Input id="username" name="username" type="text" autocomplete="username" required />
				</div>

				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input id="password" name="password" type="password" autocomplete="current-password" required />
				</div>

				{#if form?.error}
					<p class="text-center text-sm text-destructive">{form.error}</p>
				{/if}

				<Button type="submit" class="w-full">Login</Button>
			</form>
		</CardContent>
	</Card>
</main>
