<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils";
	import type { HTMLLabelAttributes } from "svelte/elements";

	type Props = HTMLLabelAttributes & {
		class?: string;
		children?: Snippet;
	};

	let { class: className, children, ...restProps }: Props = $props();
</script>

<label
	class={cn(
		"text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</label>
