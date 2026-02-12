<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = HTMLAttributes<HTMLDivElement> & {
		class?: string;
		children?: Snippet;
	};

	let { class: className, children, ...restProps }: Props = $props();
</script>

<div class={cn("p-6 pt-0", className)} {...restProps}>
	{@render children?.()}
</div>
