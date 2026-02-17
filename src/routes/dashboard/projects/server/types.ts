export type Tenant = {
	id: string;
	name: string;
	auth_config?: {
		frontend_url?: string;
	};
};
