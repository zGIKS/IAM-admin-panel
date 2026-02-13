import { dev } from "$app/environment";
import { redirect, type Handle } from "@sveltejs/kit";

const LOGIN_ROUTE = "/";
const PROTECTED_ROUTE = "/dashboard";

function isProtectedRoute(pathname: string): boolean {
	return pathname === PROTECTED_ROUTE || pathname.startsWith(`${PROTECTED_ROUTE}/`);
}

function isLikelyValidSessionToken(token: string | null): token is string {
	if (!token) {
		return false;
	}

	const trimmedToken = token.trim();
	return trimmedToken.length >= 20 && !/\s/.test(trimmedToken);
}

export const handle: Handle = async ({ event, resolve }) => {
	const rawToken = event.cookies.get("admin_session") ?? null;
	const token = isLikelyValidSessionToken(rawToken) ? rawToken : null;
	if (rawToken && !token) {
		event.cookies.set("admin_session", "", {
			httpOnly: true,
			secure: !dev,
			sameSite: "lax",
			path: "/",
			maxAge: 0
		});
	}

	event.locals.adminToken = token;
	const isLoginRoute = event.url.pathname === LOGIN_ROUTE;
	const isProtected = isProtectedRoute(event.url.pathname);

	if (!token && isProtected) {
		throw redirect(303, LOGIN_ROUTE);
	}

	if (token && isLoginRoute) {
		throw redirect(303, PROTECTED_ROUTE);
	}

	const response = await resolve(event);

	if (isLoginRoute || isProtected) {
		response.headers.set("cache-control", "no-store");
	}
	response.headers.set("x-content-type-options", "nosniff");
	response.headers.set("x-frame-options", "DENY");
	response.headers.set("referrer-policy", "no-referrer");
	response.headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");

	return response;
};
