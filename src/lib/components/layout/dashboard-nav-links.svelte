<script lang="ts">
	import { page } from "$app/state";
	import { FolderKanban, LayoutDashboard, Settings } from "@lucide/svelte";

	type NavigationItem = {
		label: string;
		href: string;
		icon: typeof LayoutDashboard;
	};

	interface Props {
		mobile?: boolean;
	}

	let { mobile = false }: Props = $props();

	const navigationItems: NavigationItem[] = [
		{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
		{ label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
		{ label: "Settings", href: "/dashboard/settings", icon: Settings }
	];

	function isActivePath(href: string): boolean {
		if (href === "/dashboard") {
			return page.url.pathname === href;
		}
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}

	function baseClass(): string {
		return mobile
			? "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition"
			: "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition";
	}
</script>

<nav class={mobile ? "flex flex-col gap-2" : "space-y-1.5"}>
	{#each navigationItems as item}
		<a
			href={item.href}
			class={`${baseClass()} ${isActivePath(item.href) ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted/70"}`}
		>
			<item.icon class="size-4" />
			<span class={mobile ? "flex-1" : ""}>{item.label}</span>
		</a>
	{/each}
</nav>
