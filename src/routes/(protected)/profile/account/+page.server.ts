import { error, fail, type ActionFailure } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

import { userUpdateSchema } from '$lib/server/db/schemas/user/schema';
import { updateUser } from '$lib/server/db/schemas/user/userHandler';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.user) {
		error(401);
	}

	return {
		user: locals.user
	};
};

type UpdateMessage = { message: { type: 'success' | 'error'; content: string } };

export const actions: Actions = {
	default: async ({ request, locals }): Promise<UpdateMessage | ActionFailure<UpdateMessage>> => {
		if (!locals.session || !locals.user) {
			return error(401);
		}

		const formData = await request.formData();
		const schemaResult = userUpdateSchema.safeParse(Object.fromEntries(formData));
		if (!schemaResult.success) {
			return fail(400, { message: { type: 'error', content: 'Could not update your account' } });
		}

		const wasUpdated = updateUser(locals.user.id, schemaResult.data);
		if (!wasUpdated) {
			error(500);
		}

		return {
			message: { type: 'success', content: 'Your account was successfully updated' }
		};
	}
};
