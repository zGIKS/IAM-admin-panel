import { adminApiProxy } from "$lib/server/api/admin-api.proxy";
import { fail, redirect } from "@sveltejs/kit";
import type { RequestEvent } from "../../$types";
import { extractErrorMessage, requireSessionToken, requireTenantId } from "../helpers";

export async function deleteProject({ fetch, cookies, params }: RequestEvent) {
	const token = requireSessionToken(cookies.get("admin_session"));
	const id = requireTenantId(params.id);

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

	throw redirect(303, "/dashboard/projects");
}
