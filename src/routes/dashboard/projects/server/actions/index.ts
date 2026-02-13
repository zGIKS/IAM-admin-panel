import type { Actions } from "../../$types";
import { deleteProject } from "./delete";

export const actions: Actions = {
	delete: deleteProject
};
