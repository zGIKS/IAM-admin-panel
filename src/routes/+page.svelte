<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
</script>

<main class="flex min-h-screen items-center justify-center bg-background px-6">
	<Card class="w-full max-w-sm">
		<CardHeader class="text-center">
			<CardTitle>Admin Panel</CardTitle>
		</CardHeader>
		<CardContent>
			<form class="space-y-4">
				<div class="space-y-2">
					<Label for="username">Username</Label>
					<Input id="username" name="username" type="text" autocomplete="username" required />
				</div>

				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input id="password" name="password" type="password" autocomplete="current-password" required />
				</div>

				<Button type="submit" class="w-full">Login</Button>
			</form>
		</CardContent>
	</Card>
</main>
