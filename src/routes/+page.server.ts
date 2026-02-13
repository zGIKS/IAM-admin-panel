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
				error: "Username and password are required"
			});
		}

		let result;
		try {
			result = await adminAuthService.login({ username, password }, fetch);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not sign in";
			return fail(401, { error: message });
		}

		if (!result.token) {
			return fail(401, {
				error: "Login succeeded, but no token was received"
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
