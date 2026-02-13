import type { Actions, PageServerLoad } from "./$types";
import { actions as projectActions } from "./server/actions";
import { load as projectLoad } from "./server/load";

export const load: PageServerLoad = projectLoad;
export const actions: Actions = projectActions;
