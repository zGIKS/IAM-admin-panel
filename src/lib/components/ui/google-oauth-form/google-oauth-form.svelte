<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	interface Props {
		googleClientId?: string;
		googleClientSecret?: string;
	}

	let { googleClientId = "", googleClientSecret = "" }: Props = $props();
</script>

<form method="POST" action="?/rotateGoogleOauth" class="space-y-4">
	<div class="space-y-2">
		<Label for="google_client_id">Google client ID</Label>
		<Input
			id="google_client_id"
			name="google_client_id"
			type="text"
			required
			value={googleClientId}
		/>
	</div>
	<div class="space-y-2">
		<Label for="google_client_secret">Google client secret</Label>
		<Input id="google_client_secret" name="google_client_secret" type="password" required />
	</div>
	<Button type="submit">Update Google credentials</Button>
</form>