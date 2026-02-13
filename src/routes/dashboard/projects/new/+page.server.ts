import { API_BASE_URL } from "$env/static/private";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";

const TENANTS_PATH = "/api/v1/tenants";

export const actions: Actions = {
	default: async ({ request, fetch, cookies }) => {
		const token = cookies.get("admin_session");

		if (!token) {
			throw redirect(303, "/");
		}

		const data = await request.formData();
		const name = String(data.get("name") ?? "").trim();

		if (!name) {
			return fail(400, { error: "El nombre del proyecto es requerido" });
		}

		const response = await fetch(`${API_BASE_URL}${TENANTS_PATH}`, {
			method: "POST",
			headers: {
				authorization: `Bearer ${token}`,
				"content-type": "application/json"
			},
			body: JSON.stringify({ name })
		});

		if (!response.ok) {
			let message = "No se pudo crear el proyecto";

			try {
				const body = await response.json();
				if (typeof body?.message === "string" && body.message.length > 0) {
					message = body.message;
				}
			} catch {
				// keep default message
			}

			return fail(response.status, { error: message });
		}

		throw redirect(303, "/dashboard/projects");
	}
};
