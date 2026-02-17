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
	let rawTenants: any[] = [];

	if (Array.isArray(payload)) {
		rawTenants = payload;
	} else if (payload && typeof payload === "object") {
		const maybeItems = (payload as { items?: unknown }).items;
		if (Array.isArray(maybeItems)) {
			rawTenants = maybeItems;
		} else {
			const maybeData = (payload as { data?: unknown }).data;
			if (Array.isArray(maybeData)) {
				rawTenants = maybeData;
			}
		}
	}

	return rawTenants.map((t: any) => ({
		id: String(t.id ?? ""),
		name: String(t.name ?? ""),
		auth_config: t.auth_config
			? {
					frontend_url: String(t.auth_config.frontend_url ?? "")
				}
			: undefined
	}));
}
