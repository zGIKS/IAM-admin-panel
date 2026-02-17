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
		jwt_secret?: unknown;
		jwt_signing_key?: unknown;
		jwt_signing_secret?: unknown;
		auth_config?: {
			frontend_url?: unknown;
			google_client_id?: unknown;
			google_client_secret?: unknown;
			jwt_secret?: unknown;
			jwt_signing_key?: unknown;
			jwt_signing_secret?: unknown;
		};
	};
	const id = typeof body.id === "string" ? body.id : "";
	const name = typeof body.name === "string" ? body.name : "";
	const anonKey = typeof body.anon_key === "string" ? body.anon_key : "";
	const frontendUrl =
		typeof body.auth_config?.frontend_url === "string" ? body.auth_config.frontend_url : undefined;
	const googleClientId =
		typeof body.auth_config?.google_client_id === "string" ? body.auth_config.google_client_id : undefined;
	const googleClientSecret =
		typeof body.auth_config?.google_client_secret === "string"
			? body.auth_config.google_client_secret
			: undefined;
	const jwtSecretCandidates = [
		body.auth_config?.jwt_secret,
		body.auth_config?.jwt_signing_secret,
		body.auth_config?.jwt_signing_key,
		body.jwt_secret,
		body.jwt_signing_secret,
		body.jwt_signing_key
	];
	const jwtSecret = jwtSecretCandidates.find(
		(candidate): candidate is string => typeof candidate === "string" && candidate.length > 0
	);

	if (!id || !name) {
		return null;
	}

	return {
		id,
		name,
		anon_key: anonKey,
		auth_config: {
			frontend_url: frontendUrl,
			google_client_id: googleClientId,
			google_client_secret: googleClientSecret,
			jwt_secret: jwtSecret
		}
	};
}
