import { redirect, type Handle } from "@sveltejs/kit";

const LOGIN_ROUTE = "/";
const PROTECTED_ROUTE = "/dashboard";

function isProtectedRoute(pathname: string): boolean {
	return pathname === PROTECTED_ROUTE || pathname.startsWith(`${PROTECTED_ROUTE}/`);
}

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get("admin_session") ?? null;
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

	return response;
};
