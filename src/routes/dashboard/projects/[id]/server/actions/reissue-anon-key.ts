import { adminApiProxy } from "$lib/server/api/admin-api.proxy";
import { fail, redirect } from "@sveltejs/kit";
import type { RequestEvent } from "../../$types";
import { extractErrorMessage, requireSessionToken, requireTenantId } from "../helpers";

export async function reissueAnonKey({ fetch, cookies, params }: RequestEvent) {
	const token = requireSessionToken(cookies.get("admin_session"));
	const id = requireTenantId(params.id);

	let response: Response;
	try {
		response = await adminApiProxy.reissueTenantAnonKey(token, id, fetch);
	} catch {
		return fail(503, { error: "Could not connect to reissue the anon key" });
	}

	if (response.status === 401) {
		throw redirect(303, "/");
	}
	if (!response.ok) {
		const message = await extractErrorMessage(response, "Could not reissue anon key");
		return fail(response.status, { error: message });
	}

	let reissuedAnonKey = "";
	try {
		const body = await response.json();
		if (typeof body?.anon_key === "string") {
			reissuedAnonKey = body.anon_key;
		}
	} catch {
		// keep fallback success message
	}

	return { success: "Anon key reissued successfully", reissuedAnonKey };
}
