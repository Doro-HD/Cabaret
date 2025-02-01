import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import { deleteSession } from '$lib/server/db/schemas/session/sessionHandler';

export const actions: Actions = {
	default: async ({ locals }) => {
		if (!locals.session) {
			return;
		}

		const wasDeleted = await deleteSession(locals.session.id);
		if (!wasDeleted) {
			error(500);
		}

		locals.session = null;
		locals.user = null;

		redirect(303, '/');
	}
};
