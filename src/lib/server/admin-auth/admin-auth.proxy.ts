import { API_BASE_URL } from "$env/static/private";
import type { AdminLoginPayload } from "./admin-auth.assembler";

const ADMIN_LOGIN_PATH = "/api/v1/admin/login";
const ADMIN_LOGOUT_PATH = "/api/v1/admin/logout";

export const adminAuthProxy = {
	async login(payload: AdminLoginPayload, fetchFn: typeof fetch) {
		const response = await fetchFn(`${API_BASE_URL}${ADMIN_LOGIN_PATH}`, {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			let message = "Credenciales invalidas";
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
		const response = await fetchFn(`${API_BASE_URL}${ADMIN_LOGOUT_PATH}`, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				accept: "*/*"
			},
			body: JSON.stringify({ token })
		});

		if (!response.ok) {
			let message = "No se pudo cerrar sesion";
			if (response.status === 400) {
				message = "Solicitud de logout invalida";
			}
			if (response.status === 401) {
				message = "Sesion no autorizada o expirada";
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
