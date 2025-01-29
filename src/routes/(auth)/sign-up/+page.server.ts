import { error, fail } from '@sveltejs/kit';
import cuid2 from '@paralleldrive/cuid2';
import { z } from 'zod';

import type { Actions } from './$types';
import { createUser } from '$lib/server/db/schemas/user/userHandler';
import {
	createSession,
	generateSessionToken,
	hahsPassword,
	setSessionTokenCookie
} from '$lib/server/auth';
import { userInsertSchema } from '$lib/server/db/schemas/user/schema';

const signUpSchema = userInsertSchema
	.omit({ id: true })
	.extend({
		'confirm-password': z.string()
	})
	.refine((val) => val.password === val['confirm-password'], {
		path: ['confirm'],
		message: 'Password must match'
	});

export const actions: Actions = {
	default: async (event) => {
		// validate form data
		const formData = await event.request.formData();
		const schemaResult = signUpSchema.safeParse(Object.fromEntries(formData));

		if (!schemaResult.success) {
			const errors = schemaResult.error.format();

			return fail(400, {
				formErrors: { ...errors }
			});
		}
		const { email, password } = schemaResult.data;

		// create user
		const passwordResult = await hahsPassword(password);
		if (!passwordResult.success) {
			error(500);
		}

		const id = cuid2.createId();
		const wasUserCreated = createUser({ id, email, password: passwordResult.hashedPassword });
		if (!wasUserCreated) {
			error(500);
		}

		// create and set session cookie
		const token = generateSessionToken();
		const sessionResult = await createSession(token, id);
		if (!sessionResult.success) {
			error(500);
		}

		setSessionTokenCookie(event, token, sessionResult.session.expiresAt);

		return {};
	}
};
