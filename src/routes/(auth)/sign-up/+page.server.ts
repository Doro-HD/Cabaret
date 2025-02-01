import { error, fail, redirect } from '@sveltejs/kit';
import cuid2 from '@paralleldrive/cuid2';
import { z } from 'zod';

import type { Actions } from './$types';
import { createUser, findUserByEmail } from '$lib/server/db/schemas/user/userHandler';
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
		path: ['confirm-password'],
		message: 'Passwords must match'
	});

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		// validate form data
		const formData = await request.formData();
		const schemaResult = signUpSchema.safeParse(Object.fromEntries(formData));

		if (!schemaResult.success) {
			const errors = schemaResult.error.format();

			return fail(400, {
				formErrors: {
					emailError: errors.email?._errors.join(','),
					passwordError: errors.password?._errors.join(','),
					confirmPasswordError: errors['confirm-password']?._errors.join(',')
				}
			});
		}
		const { email, password } = schemaResult.data;

		// check if user already exists
		const existingUser = await findUserByEmail(email);
		if (existingUser) {
			return fail(400, {
				formErrors: {
					emailError: 'An user with that email already exists'
				}
			})
		}

		// create user
		const passwordResult = await hahsPassword(password);
		if (!passwordResult.success) {
			error(500);
		}

		const id = cuid2.createId();
		const wasUserCreated = await createUser({ id, email, password: passwordResult.hashedPassword });
		console.log(wasUserCreated);
		if (!wasUserCreated) {
			error(500);
		}

		// create and set session cookie
		const token = generateSessionToken();
		const sessionResult = await createSession(token, id);
		if (!sessionResult.success) {
			error(500);
		}

		setSessionTokenCookie(cookies, token, sessionResult.session.expiresAt);

		redirect(303, '/profile');
	}
};
