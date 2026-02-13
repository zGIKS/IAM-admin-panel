import type { Tenant } from "./types";

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

export function normalizeTenants(payload: unknown): Tenant[] {
	if (Array.isArray(payload)) {
		return payload as Tenant[];
	}

	if (payload && typeof payload === "object") {
		const maybeItems = (payload as { items?: unknown }).items;
		if (Array.isArray(maybeItems)) {
			return maybeItems as Tenant[];
		}

		const maybeData = (payload as { data?: unknown }).data;
		if (Array.isArray(maybeData)) {
			return maybeData as Tenant[];
		}
	}

	return [];
}
