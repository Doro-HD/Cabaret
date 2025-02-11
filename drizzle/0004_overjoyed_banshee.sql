DROP INDEX `user_gh_id_unique`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `gh_id`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `gh_username`;