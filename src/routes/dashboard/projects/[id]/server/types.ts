export type TenantDetail = {
	id: string;
	name: string;
	anon_key: string;
	auth_config?: {
		google_client_id?: string;
		google_client_secret?: string;
		jwt_secret?: string;
	};
};
