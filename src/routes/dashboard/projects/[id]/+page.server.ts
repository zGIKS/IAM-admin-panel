import type { Actions, PageServerLoad } from "./$types";
import { actions as detailActions } from "./server/actions";
import { load as detailLoad } from "./server/load";

export const load: PageServerLoad = detailLoad;
export const actions: Actions = detailActions;
