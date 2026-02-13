<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { GoogleOAuthForm } from "$lib/components/ui/google-oauth-form";
	import { KeyDisplay } from "$lib/components/ui/key-display";
	import type { PageData } from "./$types";

	let { data, form } = $props<{
		data: PageData;
		form?: { error?: string; success?: string; reissuedAnonKey?: string };
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
				{@const anonKey = form?.reissuedAnonKey && form.reissuedAnonKey.length > 0
					? form.reissuedAnonKey
					: (data.tenant.anon_key ?? "")}
				{@const jwtSecret = data.tenant.auth_config?.jwt_secret ?? ""}

				<div class="space-y-4">
					<KeyDisplay
						label="Anon key"
						value={anonKey}
						id="anon_key"
					/>
					<KeyDisplay
						label="JWT secret"
						value={jwtSecret}
						id="jwt_secret"
					/>
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
				<GoogleOAuthForm
					googleClientId={data.tenant.auth_config?.google_client_id}
					googleClientSecret={data.tenant.auth_config?.google_client_secret}
				/>
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
