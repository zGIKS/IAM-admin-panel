import { adminApiProxy } from "$lib/server/api/admin-api.proxy";
import { getValidTenantId } from "$lib/server/tenant-id";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

type TenantDetail = {
	id: string;
	name: string;
	anon_key: string;
	auth_config?: {
		google_client_id?: string;
		jwt_secret?: string;
	};
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

function toTenantDetail(payload: unknown): TenantDetail | null {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const body = payload as {
		id?: unknown;
		name?: unknown;
		anon_key?: unknown;
		auth_config?: {
			google_client_id?: unknown;
			jwt_secret?: unknown;
		};
	};
	const id = typeof body.id === "string" ? body.id : "";
	const name = typeof body.name === "string" ? body.name : "";
	const anonKey = typeof body.anon_key === "string" ? body.anon_key : "";
	const googleClientId =
		typeof body.auth_config?.google_client_id === "string" ? body.auth_config.google_client_id : undefined;
	const jwtSecret =
		typeof body.auth_config?.jwt_secret === "string" ? body.auth_config.jwt_secret : undefined;

	if (!id || !name) {
		return null;
	}

	return {
		id,
		name,
		anon_key: anonKey,
		auth_config: {
			google_client_id: googleClientId,
			jwt_secret: jwtSecret
		}
	};
}

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	const token = cookies.get("admin_session");

	if (!token) {
		throw redirect(303, "/");
	}

	const id = getValidTenantId(params.id);
	if (!id) {
		throw redirect(303, "/dashboard/projects");
	}

	let response: Response;
	try {
		response = await adminApiProxy.getTenant(token, id, fetch);
	} catch {
		return {
			tenant: null as TenantDetail | null,
			loadError: "Could not connect to the projects service"
		};
	}

	if (response.status === 401) {
		throw redirect(303, "/");
	}

	if (response.status === 404) {
		return {
			tenant: null as TenantDetail | null,
			loadError: "Project not found"
		};
	}

	if (!response.ok) {
		const message = await extractErrorMessage(response, "Could not fetch project configuration");
		return {
			tenant: null as TenantDetail | null,
			loadError: message
		};
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

		return {
			tenant,
			loadError: null
		};
	} catch {
		return {
			tenant: null as TenantDetail | null,
			loadError: "Projects service returned an invalid response"
		};
	}
};

export const actions: Actions = {
	delete: async ({ fetch, cookies, params }) => {
		const token = cookies.get("admin_session");
		if (!token) {
			throw redirect(303, "/");
		}

		const id = getValidTenantId(params.id);
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

		throw redirect(303, "/dashboard/projects");
	},
	reissueAnonKey: async ({ fetch, cookies, params }) => {
		const token = cookies.get("admin_session");
		if (!token) {
			throw redirect(303, "/");
		}

		const id = getValidTenantId(params.id);
		if (!id) {
			return fail(400, { error: "Invalid project ID" });
		}

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

		return {
			success: "Anon key reissued successfully",
			reissuedAnonKey
		};
	},
	rotateJwtSigningKey: async ({ fetch, cookies, params }) => {
		const token = cookies.get("admin_session");
		if (!token) {
			throw redirect(303, "/");
		}

		const id = getValidTenantId(params.id);
		if (!id) {
			return fail(400, { error: "Invalid project ID" });
		}

		let response: Response;
		try {
			response = await adminApiProxy.rotateTenantJwtSigningKey(token, id, fetch);
		} catch {
			return fail(503, { error: "Could not connect to rotate the JWT signing key" });
		}

		if (response.status === 401) {
			throw redirect(303, "/");
		}

		if (!response.ok) {
			const message = await extractErrorMessage(response, "Could not rotate JWT signing key");
			return fail(response.status, { error: message });
		}

		let success = "JWT signing key rotated successfully";
		try {
			const body = await response.json();
			if (typeof body?.message === "string" && body.message.length > 0) {
				success = body.message;
			}
		} catch {
			// keep default message
		}

		return { success };
	},
	rotateGoogleOauth: async ({ request, fetch, cookies, params }) => {
		const token = cookies.get("admin_session");
		if (!token) {
			throw redirect(303, "/");
		}

		const id = getValidTenantId(params.id);
		if (!id) {
			return fail(400, { error: "Invalid project ID" });
		}

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
				{
					google_client_id: googleClientId,
					google_client_secret: googleClientSecret
				},
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
};
