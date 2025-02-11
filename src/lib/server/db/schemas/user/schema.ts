import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

import { sessionTable } from '../session/schema';

export const userTable = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	username: text('username'),
	password: text('password').notNull(),
});

export const userRelations = relations(userTable, ({ many }) => {
	return {
		sessions: many(sessionTable)
	};
});

export const userSchema = createSelectSchema(userTable);
export const userInsertSchema = createInsertSchema(userTable, {
	email: (schema) => schema.email(),
	password: (schema) => schema.min(8)
});
export const userUpdateSchema = createUpdateSchema(userTable, {
	email: (schema) => schema.email(),
	username: (schema) => schema.min(2),
	password: (schema) => schema.min(8)
});

export type User = z.infer<typeof userSchema>;
export type UserInsert = z.infer<typeof userInsertSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
