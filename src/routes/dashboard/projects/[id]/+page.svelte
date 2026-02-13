<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import type { PageData } from "./$types";

	let { data, form } = $props<{
		data: PageData;
		form?: { error?: string; success?: string; reissuedAnonKey?: string };
	}>();
</script>

<section class="space-y-6">
	<div>
		<a href="/dashboard/projects" class="text-sm text-muted-foreground hover:underline">Back to projects</a>
	</div>

	{#if data.loadError}
		<Card>
			<CardContent class="pt-6">
				<p class="text-sm text-destructive">{data.loadError}</p>
			</CardContent>
		</Card>
	{:else if data.tenant}
		<Card>
			<CardHeader>
				<CardTitle>{data.tenant.name}</CardTitle>
				<CardDescription>Project configuration and security settings</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="space-y-2">
					<Label for="anon_key">Anon key</Label>
					<Input
						id="anon_key"
						readonly
						value={form?.reissuedAnonKey && form.reissuedAnonKey.length > 0
							? form.reissuedAnonKey
							: (data.tenant.anon_key ?? "")}
					/>
				</div>

				<div class="space-y-2">
					<Label for="jwt_secret">JWT secret</Label>
					<Input id="jwt_secret" readonly value={data.tenant.auth_config?.jwt_secret ?? ""} />
				</div>
			</CardContent>
		</Card>

		{#if form?.error}
			<p class="text-sm text-destructive">{form.error}</p>
		{/if}
		{#if form?.success}
			<p class="text-sm text-emerald-600">{form.success}</p>
		{/if}

		<Card>
			<CardHeader>
				<CardTitle>Security actions</CardTitle>
				<CardDescription>Manage tenant keys and credentials</CardDescription>
			</CardHeader>
			<CardContent class="flex flex-wrap items-center gap-3">
				<form method="POST" action="?/reissueAnonKey">
					<Button type="submit" variant="outline">Reissue anon key</Button>
				</form>
				<form method="POST" action="?/rotateJwtSigningKey">
					<Button type="submit" variant="outline">Rotate JWT signing key</Button>
				</form>
			</CardContent>
		</Card>

		<Card>
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
	{/if}
</section>
