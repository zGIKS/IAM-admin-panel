<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import type { PageData } from "./$types";

	let { data, form } = $props<{
		data: PageData;
		form?: { error?: string; success?: string };
	}>();
</script>

<section class="space-y-6">
	<div>
		<a href="/dashboard/projects" class="text-sm font-medium text-muted-foreground hover:underline">
			Back to projects
		</a>
	</div>

	{#if data.loadError}
		<Card>
			<CardContent class="pt-6">
				<p class="text-sm text-destructive">{data.loadError}</p>
			</CardContent>
		</Card>
	{:else if data.tenant}
		<Card class="border bg-card/80">
			<CardHeader>
				<CardTitle>{data.tenant.name}</CardTitle>
				<CardDescription>Project configuration and security settings</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="flex flex-wrap gap-6">
					<div class="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2">
						<span class="text-sm font-medium text-muted-foreground">Database strategy</span>
						<span class="font-mono text-sm">{data.tenant.db_strategy_type}</span>
					</div>
					<div class="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2">
						<span class="text-sm font-medium text-muted-foreground">Google OAuth client ID</span>
						<span class="font-mono text-sm">{data.tenant.googleClientId ?? "Not configured"}</span>
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

		<Card class="border bg-card/80">
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

		<Card class="border bg-card/80">
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
							value={data.tenant.googleClientId ?? ""}
						/>
					</div>
					<div class="space-y-2">
						<Label for="google_client_secret">Google client secret</Label>
						<Input id="google_client_secret" name="google_client_secret" type="password" required />
					</div>
					<Button type="submit">Update Google credentials</Button>
				</form>
			</CardContent>
		</Card>

		<Card class="border bg-destructive/5">
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
