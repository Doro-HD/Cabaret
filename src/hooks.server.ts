import { redirect, type Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;

		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event.cookies, sessionToken, new Date(session.expiresAt));
	} else {
		auth.deleteSessionTokenCookie(event.cookies);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

// Should redirect a signed in user to the protected part of the app
const handlePublicRoutes: Handle = ({ event, resolve }) => {
	if (!event.route.id?.includes('(protected)') && event.locals.session) {
		redirect(303, '/profile');
	}

	return resolve(event);
};

// Should redirect anon user to the non protected pages
const handleProtectedRoutes: Handle = ({ event, resolve }) => {
	if (event.route.id?.includes('(protected)') && !event.locals.session) {
		redirect(303, '/');
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleAuth, handlePublicRoutes, handleProtectedRoutes);
