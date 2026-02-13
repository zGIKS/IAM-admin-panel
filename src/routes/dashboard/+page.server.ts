import { adminApiProxy } from "$lib/server/api/admin-api.proxy";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type Tenant = {
	id: string;
};

function normalizeTenants(payload: unknown): Tenant[] {
	if (Array.isArray(payload)) {
		return payload as Tenant[];
	}

	if (payload && typeof payload === "object") {
		const maybeItems = (payload as { items?: unknown }).items;
		if (Array.isArray(maybeItems)) {
			return maybeItems as Tenant[];
		}

		const maybeData = (payload as { data?: unknown }).data;
		if (Array.isArray(maybeData)) {
			return maybeData as Tenant[];
		}
	}

	return [];
}

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get("admin_session");

	if (!token) {
		throw redirect(303, "/");
	}

	try {
		const response = await adminApiProxy.listTenants(token, fetch);

		if (response.status === 401) {
			throw redirect(303, "/");
		}

		if (!response.ok) {
			return {
				totalProjects: 0,
				loadError: "Could not load dashboard data"
			};
		}

		const body = await response.json();
		const tenants = normalizeTenants(body);

		return {
			totalProjects: tenants.length,
			loadError: null
		};
	} catch {
		return {
			totalProjects: 0,
			loadError: "Could not connect to the projects service"
		};
	}
};
