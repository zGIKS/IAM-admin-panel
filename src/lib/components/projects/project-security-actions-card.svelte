<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
</script>

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
