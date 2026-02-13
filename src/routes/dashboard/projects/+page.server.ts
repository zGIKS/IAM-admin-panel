import { adminApiProxy } from "$lib/server/api/admin-api.proxy";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

type Tenant = {
	id: string;
	name: string;
};

async function extractErrorMessage(response: Response, fallback: string): Promise<string> {
	try {
		const body = await response.json();
		if (typeof body?.message === "string" && body.message.length > 0) {
			return body.message;
		}
	} catch {
		// keep fallback message
	}

	return fallback;
}

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

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get("admin_session");

	if (!token) {
		throw redirect(303, "/");
	}

	let response: Response;
	try {
		response = await adminApiProxy.listTenants(token, fetch);
	} catch {
		return {
			tenants: [] as Tenant[],
			loadError: "Could not connect to the projects service"
		};
	}

	if (response.status === 401) {
		throw redirect(303, "/");
	}

	if (!response.ok) {
		const message = await extractErrorMessage(response, "Could not fetch projects");
		return {
			tenants: [] as Tenant[],
			loadError: message
		};
	}

	let body: unknown;
	try {
		body = await response.json();
	} catch {
		return {
			tenants: [] as Tenant[],
			loadError: "Projects service returned an invalid response"
		};
	}
	const tenants = normalizeTenants(body);

	return {
		tenants,
		loadError: null
	};
};

export const actions: Actions = {
	delete: async ({ request, fetch, cookies }) => {
		const token = cookies.get("admin_session");

		if (!token) {
			throw redirect(303, "/");
		}

		const data = await request.formData();
		const id = String(data.get("id") ?? "").trim();

		if (!id) {
			return fail(400, { error: "Invalid project ID" });
		}

		let response: Response;
		try {
			response = await adminApiProxy.deleteTenant(token, id, fetch);
		} catch {
			return fail(503, { error: "Could not connect to delete the project" });
		}

		if (response.status === 401) {
			throw redirect(303, "/");
		}

		if (!response.ok) {
			const message = await extractErrorMessage(response, "Could not delete the project");
			return fail(response.status, { error: message });
		}

		return { success: true };
	}
};
