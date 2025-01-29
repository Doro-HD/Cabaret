import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { userTable } from '../user/schema';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

export const sessionTable = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const sessionRelations = relations(sessionTable, ({ one }) => {
    return {
        user: one(userTable, {
            fields: [sessionTable.userId],
            references: [userTable.id]
        })
    }
});

export const sessionSelectSchema = createSelectSchema(sessionTable);
export const sessionInsertSchema = createInsertSchema(sessionTable);
export const sessionUpdateSchema = createUpdateSchema(sessionTable).omit( { id: true });

export type Session = z.infer<typeof sessionSelectSchema>;
export type SessionInsert = z.infer<typeof sessionInsertSchema>;
export type SessionUpdate = z.infer<typeof sessionUpdateSchema>;
