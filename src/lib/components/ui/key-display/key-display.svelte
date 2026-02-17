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
	let copyError = $state<string | null>(null);

	function fallbackCopyText(text: string) {
		const textArea = document.createElement("textarea");
		textArea.value = text;
		textArea.setAttribute("readonly", "");
		textArea.style.position = "fixed";
		textArea.style.opacity = "0";
		document.body.appendChild(textArea);
		textArea.select();
		textArea.setSelectionRange(0, textArea.value.length);
		const copiedWithFallback = document.execCommand("copy");
		document.body.removeChild(textArea);
		return copiedWithFallback;
	}

	async function copyToClipboard() {
		copyError = null;
		if (!value || value.trim().length === 0) {
			copyError = "No value available to copy";
			return;
		}

		let didCopy = false;
		if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(value);
				didCopy = true;
			} catch {
				didCopy = false;
			}
		}

		if (!didCopy && typeof document !== "undefined") {
			didCopy = fallbackCopyText(value);
		}

		if (!didCopy) {
			if (typeof window !== "undefined") {
				window.prompt("Copy this value manually:", value);
			}
			copyError = "Browser blocked automatic copy";
			return;
		}

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
	{#if copyError}
		<p class="text-xs text-destructive">{copyError}</p>
	{/if}
</div>
