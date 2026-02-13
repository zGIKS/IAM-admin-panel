<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import DashboardNavLinks from "$lib/components/layout/dashboard-nav-links.svelte";
	import { Menu, X } from "@lucide/svelte";
	import { fly } from "svelte/transition";

	let { children } = $props();
	let sidebarOpen = $state(true);
</script>

<div class="min-h-screen bg-background text-foreground">
	<header class="md:hidden fixed inset-x-0 top-0 z-30 border-b bg-card/90 backdrop-blur">
		<div class="mx-auto flex h-16 max-w-screen-sm items-center justify-between px-4">
			<Button
				type="button"
				onclick={() => (sidebarOpen = !sidebarOpen)}
				variant="outline"
				size="icon"
				class="shadow-md"
				aria-label="Toggle sidebar menu"
			>
				{#if sidebarOpen}<X class="size-5" />{:else}<Menu class="size-5" />{/if}
			</Button>
			<h1 class="text-sm font-semibold uppercase tracking-[0.18em]">Admin Panel</h1>
			<div class="size-10" aria-hidden="true"></div>
		</div>
	</header>

	<div class="relative flex min-h-screen">
		{#if sidebarOpen}
			<aside
				class="md:hidden fixed inset-x-0 top-16 z-20 border-t bg-card/90 px-4 pb-6 pt-4 backdrop-blur"
				transition:fly={{ y: -8, duration: 180 }}
			>
				<div class="mb-4 px-2">
					<p class="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Navigation</p>
				</div>
				<DashboardNavLinks mobile />
			</aside>
		{/if}

		<aside class="hidden md:block w-72 border-r bg-card/90 px-5 pb-6 pt-8 backdrop-blur">
			<div class="mb-6 px-2">
				<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Workspace</p>
				<p class="mt-2 text-lg font-semibold tracking-tight">Admin Panel</p>
			</div>
			<DashboardNavLinks />
		</aside>

		<main class="flex-1 px-5 pb-8 pt-20 md:px-10 md:pt-10">
			<div class="mx-auto w-full max-w-6xl rounded-2xl border bg-card/70 p-4 shadow-sm backdrop-blur-sm md:p-8">
				{@render children()}
			</div>
		</main>
	</div>
</div>
