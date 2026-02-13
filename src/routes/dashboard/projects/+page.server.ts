import { API_BASE_URL } from "$env/static/private";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

const TENANTS_PATH = "/api/v1/tenants";

type Tenant = {
	id: string;
	name: string;
	active: boolean;
	db_strategy_type: string;
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
		response = await fetch(`${API_BASE_URL}${TENANTS_PATH}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json"
			}
		});
	} catch {
		return {
			tenants: [] as Tenant[],
			loadError: "No se pudo conectar con el servicio de proyectos"
		};
	}

	if (response.status === 401) {
		throw redirect(303, "/");
	}

	if (!response.ok) {
		const message = await extractErrorMessage(response, "No se pudieron obtener los proyectos");
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
			loadError: "El servicio de proyectos devolvio una respuesta invalida"
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
			return fail(400, { error: "ID de proyecto invalido" });
		}

		let response: Response;
		try {
			response = await fetch(`${API_BASE_URL}${TENANTS_PATH}/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "*/*"
				}
			});
		} catch {
			return fail(503, { error: "No se pudo conectar para borrar el proyecto" });
		}

		if (response.status === 401) {
			throw redirect(303, "/");
		}

		if (!response.ok) {
			const message = await extractErrorMessage(response, "No se pudo borrar el proyecto");
			return fail(response.status, { error: message });
		}

		return { success: true };
	}
};
