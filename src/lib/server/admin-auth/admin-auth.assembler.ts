export type AdminLoginInput = {
	username: string;
	password: string;
};

export type AdminLoginPayload = {
	username: string;
	password: string;
};

export const adminAuthAssembler = {
	toLoginPayload(input: AdminLoginInput): AdminLoginPayload {
		return {
			username: input.username,
			password: input.password
		};
	}
};
