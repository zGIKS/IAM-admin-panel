import { adminApiProxy } from "$lib/server/api/admin-api.proxy";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import type { TenantDetail } from "./types";
import { extractErrorMessage, requireSessionToken, requireTenantId, toTenantDetail } from "./helpers";

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	const token = requireSessionToken(cookies.get("admin_session"));
	const id = requireTenantId(params.id);

	let response: Response;
	try {
		response = await adminApiProxy.getTenant(token, id, fetch);
	} catch {
		return { tenant: null as TenantDetail | null, loadError: "Could not connect to the projects service" };
	}

	if (response.status === 401) {
		throw redirect(303, "/");
	}
	if (response.status === 404) {
		return { tenant: null as TenantDetail | null, loadError: "Project not found" };
	}
	if (!response.ok) {
		const message = await extractErrorMessage(response, "Could not fetch project configuration");
		return { tenant: null as TenantDetail | null, loadError: message };
	}

	try {
		const payload = await response.json();
		const tenant = toTenantDetail(payload);
		if (!tenant) {
			return {
				tenant: null as TenantDetail | null,
				loadError: "Projects service returned an invalid project payload"
			};
		}

		return { tenant, loadError: null };
	} catch {
		return { tenant: null as TenantDetail | null, loadError: "Projects service returned an invalid response" };
	}
};
