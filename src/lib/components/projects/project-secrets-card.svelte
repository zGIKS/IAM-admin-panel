<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { KeyDisplay } from "$lib/components/ui/key-display";

	interface Props {
		projectName: string;
		anonKey: string;
		jwtSecret: string;
	}

	let { projectName, anonKey, jwtSecret }: Props = $props();
</script>

<Card class="border bg-card/80">
	<CardHeader>
		<CardTitle>{projectName}</CardTitle>
		<CardDescription>Project configuration and security settings</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="space-y-4">
			<KeyDisplay label="Anon key" value={anonKey} id="anon_key" />
			<KeyDisplay label="JWT secret" value={jwtSecret} id="jwt_secret" />
		</div>
	</CardContent>
</Card>
