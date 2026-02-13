const TENANT_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

export function getValidTenantId(raw: unknown): string | null {
	const id = String(raw ?? "").trim();
	if (!TENANT_ID_PATTERN.test(id)) {
		return null;
	}

	return id;
}
