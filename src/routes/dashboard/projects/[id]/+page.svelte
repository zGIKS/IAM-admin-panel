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
				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-1">
						<p class="text-xs text-muted-foreground">Project ID</p>
						<p class="text-sm font-medium break-all">{data.tenant.id}</p>
					</div>
					<div class="space-y-1">
						<p class="text-xs text-muted-foreground">Database strategy</p>
						<p class="text-sm font-medium">{data.tenant.db_strategy_type}</p>
					</div>
				</div>

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

				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="google_client_id_display">Google client ID</Label>
						<Input id="google_client_id_display" readonly value={data.tenant.auth_config?.google_client_id ?? ""} />
					</div>
					<div class="space-y-2">
						<Label for="google_client_secret_display">Google client secret</Label>
						<Input
							id="google_client_secret_display"
							readonly
							value={data.tenant.auth_config?.google_client_secret ?? ""}
						/>
					</div>
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
				<CardTitle>Rotate Google OAuth credentials</CardTitle>
				<CardDescription>Update Google client credentials for this tenant</CardDescription>
			</CardHeader>
			<CardContent>
				<form method="POST" action="?/rotateGoogleOauth" class="space-y-4">
					<div class="space-y-2">
						<Label for="google_client_id">Google client ID</Label>
						<Input
							id="google_client_id"
							name="google_client_id"
							type="text"
							required
							value={data.tenant.auth_config?.google_client_id ?? ""}
						/>
					</div>
					<div class="space-y-2">
						<Label for="google_client_secret">Google client secret</Label>
						<Input
							id="google_client_secret"
							name="google_client_secret"
							type="text"
							required
							value={data.tenant.auth_config?.google_client_secret ?? ""}
						/>
					</div>
					<Button type="submit">Update Google credentials</Button>
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
