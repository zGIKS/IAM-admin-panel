import { adminApiProxy } from "$lib/server/api/admin-api.proxy";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
	default: async ({ request, fetch, cookies }) => {
		const token = cookies.get("admin_session");

		if (!token) {
			throw redirect(303, "/");
		}

		const data = await request.formData();
		const name = String(data.get("name") ?? "").trim();

		if (!name) {
			return fail(400, { error: "Project name is required" });
		}

		const response = await adminApiProxy.createTenant(token, name, fetch);

		if (!response.ok) {
			let message = "Could not create the project";

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
