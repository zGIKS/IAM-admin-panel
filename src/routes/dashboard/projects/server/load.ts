import { adminApiProxy } from "$lib/server/api/admin-api.proxy";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import type { Tenant } from "./types";
import { extractErrorMessage, normalizeTenants } from "./helpers";

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get("admin_session");
	if (!token) {
		throw redirect(303, "/");
	}

	let response: Response;
	try {
		response = await adminApiProxy.listTenants(token, fetch);
	} catch {
		return { tenants: [] as Tenant[], loadError: "Could not connect to the projects service" };
	}

	if (response.status === 401) {
		throw redirect(303, "/");
	}
	if (!response.ok) {
		const message = await extractErrorMessage(response, "Could not fetch projects");
		return { tenants: [] as Tenant[], loadError: message };
	}

	let body: unknown;
	try {
		body = await response.json();
	} catch {
		return { tenants: [] as Tenant[], loadError: "Projects service returned an invalid response" };
	}

	return { tenants: normalizeTenants(body), loadError: null };
};
