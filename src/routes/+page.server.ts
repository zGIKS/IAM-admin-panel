import { dev } from "$app/environment";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "@sveltejs/kit";
import { adminAuthService } from "$lib/server/admin-auth/admin-auth.service";

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const data = await request.formData();
		const username = String(data.get("username") ?? "").trim();
		const password = String(data.get("password") ?? "");

		if (!username || !password) {
			return fail(400, {
				error: "Usuario y password son requeridos"
			});
		}

		let result;
		try {
			result = await adminAuthService.login({ username, password }, fetch);
		} catch (error) {
			const message = error instanceof Error ? error.message : "No se pudo iniciar sesion";
			return fail(401, { error: message });
		}

		if (!result.token) {
			return fail(401, {
				error: "Login exitoso, pero no se recibio token"
			});
		}

		cookies.set("admin_session", result.token, {
			httpOnly: true,
			secure: !dev,
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 8
		});

		throw redirect(303, "/dashboard");
	}
};
