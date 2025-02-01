import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import { userSchema } from '$lib/server/db/schemas/user/schema';
import { findUserByEmail } from '$lib/server/db/schemas/user/userHandler';
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie,
	verifyPassword
} from '$lib/server/auth';

const signInSchema = userSchema.pick({ email: true, password: true });

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		// validate form data
		const formData = await request.formData();

		const schemaResult = await signInSchema.safeParse(Object.fromEntries(formData));
		if (!schemaResult.success) {
			error(400);
		}
		const { email, password } = schemaResult.data;

		// find user with given email
		const userResult = await findUserByEmail(email);
		if (!userResult.success) {
			error(500);
		}

		const errorMsg = 'Incorrect email or password';
		if (!userResult.user) {
			return fail(404, { formError: errorMsg });
		}
		const user = userResult.user;

		const passwordResult = await verifyPassword(user.password, password);
		if (!passwordResult.success) {
			error(500);
		}

		if (!passwordResult.isSame) {
			return fail(400, { formError: errorMsg });
		}

		const token = generateSessionToken();
		const sessionResult = await createSession(token, user.id);
		if (!sessionResult.success) {
			error(500);
		}

		setSessionTokenCookie(cookies, token, sessionResult.session.expiresAt);

		redirect(303, '/profile');
	}
};
