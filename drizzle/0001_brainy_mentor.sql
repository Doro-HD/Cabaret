ALTER TABLE `session` ALTER COLUMN "expires_at" TO "expires_at" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `username` text;