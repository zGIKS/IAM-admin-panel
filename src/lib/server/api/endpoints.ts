export const API_ENDPOINTS = {
	adminLogin: "/api/v1/admin/login",
	adminLogout: "/api/v1/admin/logout",
	tenants: "/api/v1/tenants"
} as const;

export function tenantById(id: string): string {
	return `${API_ENDPOINTS.tenants}/${id}`;
}

export function tenantAnonKeyReissue(id: string): string {
	return `${tenantById(id)}/anon-key/reissue`;
}

export function tenantJwtSigningKeyRotate(id: string): string {
	return `${tenantById(id)}/jwt-signing-key/rotate`;
}

export function tenantGoogleOauthRotate(id: string): string {
	return `${tenantById(id)}/oauth/google/rotate`;
}
