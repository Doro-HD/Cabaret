import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { sessionTable } from '../session/schema';

export const userTable = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull(),
	password: text('password').notNull()
});

export const userRelations = relations(userTable, ({ many }) => {
    return {
        sessions: many(sessionTable)
    }
})

export type User = typeof userTable.$inferSelect;
