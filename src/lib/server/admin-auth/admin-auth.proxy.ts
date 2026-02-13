import { API_BASE_URL } from "$env/static/private";
import { API_ENDPOINTS } from "$lib/server/api/endpoints";
import type { AdminLoginPayload } from "./admin-auth.assembler";

export const adminAuthProxy = {
	async login(payload: AdminLoginPayload, fetchFn: typeof fetch) {
		const response = await fetchFn(`${API_BASE_URL}${API_ENDPOINTS.adminLogin}`, {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			let message = "Invalid credentials";
			try {
				const errorBody = await response.json();
				if (typeof errorBody?.message === "string" && errorBody.message.length > 0) {
					message = errorBody.message;
				}
			} catch {
				// keep default message
			}

			throw new Error(message);
		}

		return response.json();
	},
	async logout(token: string, fetchFn: typeof fetch) {
		const response = await fetchFn(`${API_BASE_URL}${API_ENDPOINTS.adminLogout}`, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				accept: "*/*"
			},
			body: JSON.stringify({ token })
		});

		if (!response.ok) {
			let message = "Could not sign out";
			if (response.status === 400) {
				message = "Invalid logout request";
			}
			if (response.status === 401) {
				message = "Unauthorized or expired session";
			}

			try {
				const errorBody = await response.json();
				if (typeof errorBody?.message === "string" && errorBody.message.length > 0) {
					message = errorBody.message;
				}
			} catch {
				// keep default message
			}

			throw new Error(message);
		}
	}
};
