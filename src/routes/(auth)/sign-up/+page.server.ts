import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createUser } from '$lib/server/db/schemas/user/userHandler';
import cuid2 from '@paralleldrive/cuid2';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';

export const actions: Actions = {
	default: async (event) => {
		// validate form data
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || !password) {
			error(400);
		}

		// create user
		const id = cuid2.createId();
		const wasUserCreated = createUser({ id, email, password });
		if (!wasUserCreated) {
			error(500);
		}

		// create and set session cookie
		const token = generateSessionToken();
		const session = await createSession(token, id);
		setSessionTokenCookie(event, token, new Date(session.expiresAt))

		return {};
	}
};
