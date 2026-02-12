import { adminAuthAssembler, type AdminLoginInput } from "./admin-auth.assembler";
import { adminAuthProxy } from "./admin-auth.proxy";

function extractToken(response: unknown): string | null {
	if (!response || typeof response !== "object") {
		return null;
	}

	const body = response as Record<string, unknown>;
	const nestedBody =
		typeof body.data === "object" && body.data !== null
			? (body.data as Record<string, unknown>)
			: null;
	const tokenCandidates = [
		body.token,
		body.accessToken,
		body.access_token,
		body.jwt,
		body.sessionToken,
		nestedBody?.token,
		nestedBody?.accessToken,
		nestedBody?.access_token,
		nestedBody?.jwt,
		nestedBody?.sessionToken
	];

	for (const candidate of tokenCandidates) {
		if (typeof candidate === "string" && candidate.length > 0) {
			return candidate;
		}
	}

	return null;
}

export const adminAuthService = {
	async login(input: AdminLoginInput, fetchFn: typeof fetch) {
		const payload = adminAuthAssembler.toLoginPayload(input);
		const response = await adminAuthProxy.login(payload, fetchFn);
		const token = extractToken(response);

		return {
			token,
			response
		};
	},
	async logout(token: string, fetchFn: typeof fetch) {
		await adminAuthProxy.logout(token, fetchFn);
	}
};
