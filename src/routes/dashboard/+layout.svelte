<script lang="ts">
	import { page } from "$app/state";
	import { FolderKanban, Menu, Settings, X } from "@lucide/svelte";
	import { fly } from "svelte/transition";

	let { children } = $props();
	let sidebarOpen = $state(true);

	const navigationItems = [
		{
			label: "Projects",
			href: "/dashboard/projects",
			icon: FolderKanban
		},
		{
			label: "Settings",
			href: "/dashboard/settings",
			icon: Settings
		}
	];

	function isActivePath(href: string): boolean {
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}
</script>

<div class="min-h-screen bg-background text-foreground">
	<button
		type="button"
		onclick={() => (sidebarOpen = !sidebarOpen)}
		class="fixed left-4 top-4 z-30 rounded-xl border bg-card/95 p-2.5 text-foreground shadow-md backdrop-blur-sm transition hover:bg-muted"
		aria-label="Alternar menu lateral"
	>
		{#if sidebarOpen}
			<X class="size-5" />
		{:else}
			<Menu class="size-5" />
		{/if}
	</button>

	<div class="flex min-h-screen">
		{#if sidebarOpen}
			<aside
				class="w-64 border-r bg-card/95 px-4 pb-6 pt-20 backdrop-blur-sm"
				transition:fly={{ x: -12, duration: 180 }}
			>
				<div class="mb-6 px-2">
					<p class="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Navigation</p>
				</div>
				<nav class="space-y-1.5">
					{#each navigationItems as item}
						<a
							href={item.href}
							class={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActivePath(item.href) ? "bg-muted shadow-sm" : "hover:bg-muted/70"}`}
						>
							<item.icon class="size-4" />
							<span>{item.label}</span>
						</a>
					{/each}
				</nav>
			</aside>
		{/if}

		<main class="flex-1 px-6 pb-6 pt-20 md:px-8">
			{@render children()}
		</main>
	</div>
</div>
