import type { Actions } from "../../$types";
import { deleteProject } from "./delete";
import { reissueAnonKey } from "./reissue-anon-key";
import { rotateGoogleOauth } from "./rotate-google-oauth";
import { rotateJwtSigningKey } from "./rotate-jwt-signing-key";
import { updateFrontendUrl } from "./update-frontend-url";

export const actions: Actions = {
	delete: deleteProject,
	reissueAnonKey,
	rotateJwtSigningKey,
	rotateGoogleOauth,
	updateFrontendUrl
};
