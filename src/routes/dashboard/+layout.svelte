<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { page } from "$app/state";
	import { FolderKanban, LayoutDashboard, Menu, Settings, X } from "@lucide/svelte";
	import { fly } from "svelte/transition";

	let { children } = $props();
	let sidebarOpen = $state(true);

	const navigationItems = [
		{
			label: "Dashboard",
			href: "/dashboard",
			icon: LayoutDashboard
		},
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
	<!-- Mobile header: hamburger at left, title centered in a defined container -->
	<header class="md:hidden fixed inset-x-0 top-0 z-30 border-b bg-card/95 backdrop-blur-sm">
		<div class="mx-auto flex h-16 max-w-screen-sm items-center justify-between px-4">
			<Button
				type="button"
				onclick={() => (sidebarOpen = !sidebarOpen)}
				variant="outline"
				size="icon"
				class="shadow-md"
				aria-label="Toggle sidebar menu"
			>
				{#if sidebarOpen}
					<X class="size-5" />
				{:else}
					<Menu class="size-5" />
				{/if}
			</Button>

			<h1 class="text-sm font-semibold uppercase tracking-wide">Admin Panel</h1>
			<div class="size-10" aria-hidden="true"></div>
		</div>
	</header>

	<div class="flex min-h-screen">
		<!-- Mobile sidebar (toggleable with transition) -->
		{#if sidebarOpen}
			<aside
				class="md:hidden fixed inset-x-0 top-16 z-20 border-t bg-card/95 px-4 pb-6 pt-4 backdrop-blur-sm"
				transition:fly={{ y: -8, duration: 180 }}
			>
				<div class="mb-4 px-2">
					<p class="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Navigation</p>
				</div>
				<nav class="flex flex-col gap-2">
					{#each navigationItems as item}
						<a
							href={item.href}
							class={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActivePath(item.href) ? "bg-muted shadow-sm" : "hover:bg-muted/70"}`}
						>
							<item.icon class="size-4" />
							<span class="flex-1">{item.label}</span>
						</a>
					{/each}
				</nav>
			</aside>
		{/if}

		<!-- Desktop sidebar: always visible on md+ -->
		<aside class="hidden md:block w-64 border-r bg-card/95 px-4 pb-6 pt-8">
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

		<main class="flex-1 px-6 pb-6 pt-20 md:px-8 md:pt-8">
			{@render children()}
		</main>
	</div>
</div>
