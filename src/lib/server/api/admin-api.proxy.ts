import { API_BASE_URL } from "$env/static/private";
import {
	API_ENDPOINTS,
	tenantAnonKeyReissue,
	tenantById,
	tenantFrontendUrlUpdate,
	tenantGoogleOauthRotate,
	tenantJwtSigningKeyRotate
} from "$lib/server/api/endpoints";

type FetchFn = typeof fetch;

function withAdminAuthorization(token: string, headers?: HeadersInit): HeadersInit {
	return {
		Authorization: `Bearer ${token}`,
		...headers
	};
}

export const adminApiProxy = {
	listTenants(token: string, fetchFn: FetchFn) {
		return fetchFn(`${API_BASE_URL}${API_ENDPOINTS.tenants}`, {
			headers: withAdminAuthorization(token, {
				Accept: "application/json"
			})
		});
	},
	getTenant(token: string, id: string, fetchFn: FetchFn) {
		return fetchFn(`${API_BASE_URL}${tenantById(id)}`, {
			headers: withAdminAuthorization(token, {
				Accept: "application/json"
			})
		});
	},
	createTenant(token: string, name: string, frontendUrl: string, fetchFn: FetchFn) {
		return fetchFn(`${API_BASE_URL}${API_ENDPOINTS.tenants}`, {
			method: "POST",
			headers: withAdminAuthorization(token, {
				"content-type": "application/json"
			}),
			body: JSON.stringify({ name, frontend_url: frontendUrl })
		});
	},
	updateTenantFrontendUrl(token: string, id: string, frontendUrl: string, fetchFn: FetchFn) {
		return fetchFn(`${API_BASE_URL}${tenantFrontendUrlUpdate(id)}`, {
			method: "PUT",
			headers: withAdminAuthorization(token, {
				"content-type": "application/json"
			}),
			body: JSON.stringify({ frontend_url: frontendUrl })
		});
	},
	deleteTenant(token: string, id: string, fetchFn: FetchFn) {
		return fetchFn(`${API_BASE_URL}${tenantById(id)}`, {
			method: "DELETE",
			headers: withAdminAuthorization(token, {
				Accept: "*/*"
			})
		});
	},
	reissueTenantAnonKey(token: string, id: string, fetchFn: FetchFn) {
		return fetchFn(`${API_BASE_URL}${tenantAnonKeyReissue(id)}`, {
			method: "POST",
			headers: withAdminAuthorization(token, {
				Accept: "application/json"
			})
		});
	},
	rotateTenantJwtSigningKey(token: string, id: string, fetchFn: FetchFn) {
		return fetchFn(`${API_BASE_URL}${tenantJwtSigningKeyRotate(id)}`, {
			method: "POST",
			headers: withAdminAuthorization(token, {
				Accept: "application/json"
			})
		});
	},
	rotateTenantGoogleOauth(
		token: string,
		id: string,
		payload: { google_client_id: string; google_client_secret: string },
		fetchFn: FetchFn
	) {
		return fetchFn(`${API_BASE_URL}${tenantGoogleOauthRotate(id)}`, {
			method: "POST",
			headers: withAdminAuthorization(token, {
				Accept: "application/json",
				"content-type": "application/json"
			}),
			body: JSON.stringify(payload)
		});
	}
};
