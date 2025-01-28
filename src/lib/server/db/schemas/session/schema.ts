import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { userTable } from '../user/schema';

export const sessionTable = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull(),
	expiresAt: text('expires_at').notNull()
});

export const sessionRelations = relations(sessionTable, ({ one }) => {
    return {
        user: one(userTable, {
            fields: [sessionTable.userId],
            references: [userTable.id]
        })
    }
});

export type Session = typeof sessionTable.$inferSelect;
