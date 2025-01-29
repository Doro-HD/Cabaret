import { eq } from 'drizzle-orm';

import { db } from '../..';
import type { User } from '../user/schema';
import { sessionTable, type Session, type SessionInsert, type SessionUpdate } from './schema';

export async function createSession(session: SessionInsert): Promise<boolean> {
	try {
		await db.insert(sessionTable).values(session);

		return true;
	} catch {
		return false;
	}
}

export async function findSession(
	sessionId: string
): Promise<{ success: true; data?: { session: Session; user: User } } | { success: false }> {
	try {
		const session = await db.query.sessionTable.findFirst({
			where: (sessions, { eq }) => eq(sessions.id, sessionId),
			with: {
				user: true
			}
		});

		if (!session) {
			return { success: true };
		}

		return { success: true, data: { session, user: session.user } };
	} catch {
		return { success: false };
	}
}

export async function updateSession(sessionId: string, session: SessionUpdate): Promise<boolean> {
	try {
		await db.update(sessionTable).set(session).where(eq(sessionTable.id, sessionId));

		return true;
	} catch {
		return false;
	}
}

export async function deleteSession(sessionId: string): Promise<boolean> {
	try {
		await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));

		return true;
	} catch {
		return false;
	}
}
