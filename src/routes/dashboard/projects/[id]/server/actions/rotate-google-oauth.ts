import { adminApiProxy } from "$lib/server/api/admin-api.proxy";
import { fail, redirect } from "@sveltejs/kit";
import type { RequestEvent } from "../../$types";
import { extractErrorMessage, requireSessionToken, requireTenantId } from "../helpers";

export async function rotateGoogleOauth({ request, fetch, cookies, params }: RequestEvent) {
	const token = requireSessionToken(cookies.get("admin_session"));
	const id = requireTenantId(params.id);

	const data = await request.formData();
	const googleClientId = String(data.get("google_client_id") ?? "").trim();
	const googleClientSecret = String(data.get("google_client_secret") ?? "").trim();
	if (!googleClientId || !googleClientSecret) {
		return fail(400, { error: "Google client ID and secret are required" });
	}

	let response: Response;
	try {
		response = await adminApiProxy.rotateTenantGoogleOauth(
			token,
			id,
			{ google_client_id: googleClientId, google_client_secret: googleClientSecret },
			fetch
		);
	} catch {
		return fail(503, { error: "Could not connect to rotate Google OAuth credentials" });
	}

	if (response.status === 401) {
		throw redirect(303, "/");
	}
	if (!response.ok) {
		const message = await extractErrorMessage(response, "Could not rotate Google OAuth credentials");
		return fail(response.status, { error: message });
	}

	let success = "Google OAuth credentials updated successfully";
	try {
		const body = await response.json();
		if (typeof body?.message === "string" && body.message.length > 0) {
			success = body.message;
		}
	} catch {
		// keep default message
	}

	return { success };
}
