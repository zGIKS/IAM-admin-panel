import { API_BASE_URL } from "$env/static/private";
import { API_ENDPOINTS, tenantById } from "$lib/server/api/endpoints";

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
	createTenant(token: string, name: string, fetchFn: FetchFn) {
		return fetchFn(`${API_BASE_URL}${API_ENDPOINTS.tenants}`, {
			method: "POST",
			headers: withAdminAuthorization(token, {
				"content-type": "application/json"
			}),
			body: JSON.stringify({ name })
		});
	},
	deleteTenant(token: string, id: string, fetchFn: FetchFn) {
		return fetchFn(`${API_BASE_URL}${tenantById(id)}`, {
			method: "DELETE",
			headers: withAdminAuthorization(token, {
				Accept: "*/*"
			})
		});
	}
};
