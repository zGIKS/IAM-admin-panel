<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { KeyDisplay } from "$lib/components/ui/key-display";

	interface Props {
		projectName: string;
		anonKey: string;
	}

	let { projectName, anonKey }: Props = $props();
</script>

<Card class="border bg-card/80">
	<CardHeader>
		<CardTitle>{projectName}</CardTitle>
		<CardDescription>Project configuration and security settings</CardDescription>
	</CardHeader>
		<CardContent>
			<div class="space-y-4">
				<KeyDisplay label="Anon key" value={anonKey} id="anon_key" />
			</div>
		</CardContent>
	</Card>
