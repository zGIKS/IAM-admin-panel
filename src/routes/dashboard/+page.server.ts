import { dev } from "$app/environment";
import { redirect, type Actions } from "@sveltejs/kit";
import { adminAuthService } from "$lib/server/admin-auth/admin-auth.service";

export const actions: Actions = {
	logout: async ({ cookies, fetch }) => {
		const token = cookies.get("admin_session");

		if (token) {
			try {
				await adminAuthService.logout(token, fetch);
			} catch {}
		}

		cookies.set("admin_session", "", {
			httpOnly: true,
			secure: !dev,
			sameSite: "lax",
			path: "/",
			maxAge: 0
		});

		throw redirect(303, "/");
	}
};
