import { getValidTenantId } from "$lib/server/tenant-id";
import { redirect } from "@sveltejs/kit";
import type { TenantDetail } from "./types";

export function requireSessionToken(token: string | undefined): string {
	if (!token) {
		throw redirect(303, "/");
	}

	return token;
}

export function requireTenantId(rawId: unknown): string {
	const id = getValidTenantId(rawId);
	if (!id) {
		throw redirect(303, "/dashboard/projects");
	}

	return id;
}

export async function extractErrorMessage(response: Response, fallback: string): Promise<string> {
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

export function toTenantDetail(payload: unknown): TenantDetail | null {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const body = payload as {
		id?: unknown;
		name?: unknown;
		anon_key?: unknown;
		auth_config?: {
			google_client_id?: unknown;
			google_client_secret?: unknown;
			jwt_secret?: unknown;
		};
	};
	const id = typeof body.id === "string" ? body.id : "";
	const name = typeof body.name === "string" ? body.name : "";
	const anonKey = typeof body.anon_key === "string" ? body.anon_key : "";
	const googleClientId =
		typeof body.auth_config?.google_client_id === "string" ? body.auth_config.google_client_id : undefined;
	const googleClientSecret =
		typeof body.auth_config?.google_client_secret === "string"
			? body.auth_config.google_client_secret
			: undefined;
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
			google_client_secret: googleClientSecret,
			jwt_secret: jwtSecret
		}
	};
}
