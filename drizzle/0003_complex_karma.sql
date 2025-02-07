ALTER TABLE `user` ADD `gh_id` text;--> statement-breakpoint
ALTER TABLE `user` ADD `gh_username` text;--> statement-breakpoint
CREATE UNIQUE INDEX `user_gh_id_unique` ON `user` (`gh_id`);