import { eq } from 'drizzle-orm';

import { db } from '../..';
import { userTable, type User, type UserInsert, type UserUpdate } from './schema';
import cuid2 from '@paralleldrive/cuid2';

export async function createUser(user: UserInsert): Promise<boolean> {
	try {
		await db.insert(userTable).values(user);

		return true;
	} catch {
		return false;
	}
}

export async function createUserViaGithub(ghId: string, ghUsername: string): Promise<{ success: true, user: UserInsert } | { success: false }> {
	try {
		const id = cuid2.createId();
		const user: UserInsert = { id, email: '', password: '', ghId, ghUsername };

		await db.insert(userTable).values(user);

		return { success: true, user };
	} catch {
		return { success: false };
	}
}

export async function findUserByEmail(
	email: string
): Promise<{ success: true; user?: User } | { success: false }> {
	try {
		const user = await db.query.userTable.findFirst({
			where: (user, { eq }) => eq(user.email, email)
		});

		return { success: true, user };
	} catch {
		return { success: false };
	}
}

export async function findUserByGithubId(ghId: string): Promise<{ success: true, user?: User } | { success: false }> {
	try {
		const user = await db.query.userTable.findFirst({
			where: (user, { eq }) => eq(user.ghId, ghId)
		});

		return { success: true, user };
	} catch {
		return {
			success: false
		};
	}
}

export async function updateUser(userId: string, user: UserUpdate): Promise<boolean> {
	try {
		await db.update(userTable).set(user).where(eq(userTable.id, userId));

		return true;
	} catch {
		return false;
	}
}
