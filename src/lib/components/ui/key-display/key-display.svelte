<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	interface Props {
		label: string;
		value: string;
		id?: string;
	}

	let { label, value, id }: Props = $props();

	const MASKED_SECRET = "****************";
	let copied = $state(false);

	async function copyToClipboard() {
		if (!value) {
			return;
		}

		await navigator.clipboard.writeText(value);
		copied = true;
		setTimeout(() => (copied = false), 1800);
	}
</script>

<div class="grid gap-2">
	<Label for={id}>{label}</Label>
	<div class="flex gap-2">
		<Input {id} class="font-mono tracking-[0.18em]" value={MASKED_SECRET} readonly />
		<Button type="button" variant="outline" onclick={copyToClipboard}>
			{copied ? "Copied" : "Copy"}
		</Button>
	</div>
</div>