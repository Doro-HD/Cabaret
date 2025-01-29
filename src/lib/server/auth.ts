import type { RequestEvent } from '@sveltejs/kit';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';

import { type Session } from './db/schemas/session/schema';
import * as sessionHandler from './db/schemas/session/sessionHandler';
import type { User } from './db/schemas/user/schema';
import * as argon2 from 'argon2';

// session

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);

	return token;
}

export async function createSession(
	token: string,
	userId: string
): Promise<{ success: true; session: Session } | { success: false }> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	const wasSuccesfull = await sessionHandler.createSession(session);
	if (!wasSuccesfull) {
		return { success: false };
	}

	return { success: true, session };
}

export async function validateSessionToken(
	token: string
): Promise<{ session: Session | null; user: User | null }> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await sessionHandler.findSession(sessionId);

	if (!result.success) {
		return { session: null, user: null };
	}

	if (!result.data) {
		return { session: null, user: null };
	}

	const { session, user } = result.data;
	const sessionExpiresAt = new Date(session.expiresAt);

	const sessionExpired = Date.now() >= sessionExpiresAt.getTime();
	if (sessionExpired) {
		sessionHandler.deleteSession(session.id);
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= sessionExpiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		const newExpiration = new Date(Date.now() + DAY_IN_MS * 30);
		await sessionHandler.updateSession(session.id, { ...session, expiresAt: newExpiration });
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string): Promise<boolean> {
	const wasDeleted = await sessionHandler.deleteSession(sessionId);

	return wasDeleted;
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}

// password

export async function hahsPassword(
	password: string
): Promise<{ success: true; hashedPassword: string } | { success: false }> {
	try {
		const hash = await argon2.hash(password);

		return { success: true, hashedPassword: hash };
	} catch {
		return { success: false };
	}
}

export async function verifyPassword(
	hashedPassword: string,
	password: string
): Promise<{ success: true; isSame: boolean } | { success: false }> {
	try {
		const isSame = await argon2.verify(hashedPassword, password);

		return { success: true, isSame };
	} catch {
		return { success: false };
	}
}
