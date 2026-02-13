<script lang="ts">
	import ProjectDangerZoneCard from "$lib/components/projects/project-danger-zone-card.svelte";
	import ProjectSecretsCard from "$lib/components/projects/project-secrets-card.svelte";
	import ProjectSecurityActionsCard from "$lib/components/projects/project-security-actions-card.svelte";
	import { Card, CardContent } from "$lib/components/ui/card";
	import { GoogleOAuthForm } from "$lib/components/ui/google-oauth-form";
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
		{@const anonKey = form?.reissuedAnonKey && form.reissuedAnonKey.length > 0
			? form.reissuedAnonKey
			: (data.tenant.anon_key ?? "")}
		{@const jwtSecret = data.tenant.auth_config?.jwt_secret ?? ""}

		<ProjectSecretsCard projectName={data.tenant.name} {anonKey} {jwtSecret} />

		{#if form?.error}
			<p class="text-sm text-destructive">{form.error}</p>
		{/if}
		{#if form?.success}
			<p class="text-sm text-emerald-600">{form.success}</p>
		{/if}

		<ProjectSecurityActionsCard />

		<Card class="border bg-card/80">
			<CardContent class="pt-6">
				<GoogleOAuthForm
					googleClientId={data.tenant.auth_config?.google_client_id}
					googleClientSecret={data.tenant.auth_config?.google_client_secret}
				/>
			</CardContent>
		</Card>

		<ProjectDangerZoneCard />
	{/if}
</section>
