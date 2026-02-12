<script lang="ts">
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = HTMLAttributes<HTMLHeadingElement> & {
		class?: string;
		children?: Snippet;
	};

	let { class: className, children, ...restProps }: Props = $props();
</script>

<h3 class={cn("leading-none font-semibold tracking-tight", className)} {...restProps}>
	{@render children?.()}
</h3>
