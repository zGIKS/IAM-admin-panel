import { adminApiProxy } from "$lib/server/api/admin-api.proxy";
import { fail } from "@sveltejs/kit";
import type { Action } from "../../$types";
import { extractErrorMessage, requireSessionToken, requireTenantId } from "../helpers";

export const updateFrontendUrl: Action = async ({ request, fetch, cookies, params }) => {
	const token = requireSessionToken(cookies.get("admin_session"));
	const id = requireTenantId(params.id);

	const data = await request.formData();
	const frontendUrl = String(data.get("frontend_url") ?? "").trim();

	if (!frontendUrl) {
		return fail(400, { error: "Frontend URL is required" });
	}

	let response: Response;
	try {
		response = await adminApiProxy.updateTenantFrontendUrl(token, id, frontendUrl, fetch);
	} catch {
		return fail(503, { error: "Could not connect to the projects service" });
	}

	if (!response.ok) {
		const message = await extractErrorMessage(response, "Could not update frontend URL");
		return fail(response.status, { error: message });
	}

	return { success: "Frontend URL updated successfully" };
};
