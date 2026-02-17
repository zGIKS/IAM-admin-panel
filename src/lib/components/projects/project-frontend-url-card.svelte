<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { enhance } from "$app/forms";

	let { frontendUrl = "" } = $props<{ frontendUrl?: string }>();
	let loading = $state(false);
</script>

<Card class="border bg-card/80">
	<CardHeader>
		<CardTitle>Frontend URL</CardTitle>
		<CardDescription>
			Update the URL where your frontend application is hosted. This is used for redirects and
			security checks.
		</CardDescription>
	</CardHeader>
	<CardContent>
		<form
			method="POST"
			action="?/updateFrontendUrl"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
			class="space-y-4"
		>
			<div class="space-y-2">
				<Label for="frontend_url">Frontend URL</Label>
				<Input
					id="frontend_url"
					name="frontend_url"
					type="url"
					required
					value={frontendUrl}
					placeholder="https://myapp.com"
				/>
			</div>

			<Button type="submit" disabled={loading}>
				{loading ? "Updating..." : "Update URL"}
			</Button>
		</form>
	</CardContent>
</Card>
