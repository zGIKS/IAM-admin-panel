import { adminApiProxy } from "$lib/server/api/admin-api.proxy";
import { getValidTenantId } from "$lib/server/tenant-id";
import { fail, redirect } from "@sveltejs/kit";
import type { RequestEvent } from "../../$types";
import { extractErrorMessage } from "../helpers";

export async function deleteProject({ request, fetch, cookies }: RequestEvent) {
	const token = cookies.get("admin_session");
	if (!token) {
		throw redirect(303, "/");
	}

	const id = getValidTenantId((await request.formData()).get("id"));
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
