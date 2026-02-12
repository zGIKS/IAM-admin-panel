<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLInputAttributes } from "svelte/elements";

	type Props = HTMLInputAttributes & {
		class?: string;
	};

	let { class: className, type = "text", ...restProps }: Props = $props();
</script>

<input
	{type}
	class={cn(
		"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		className
	)}
	{...restProps}
/>
