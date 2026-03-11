CREATE TABLE `discount_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`amount` integer NOT NULL,
	`min_year` integer,
	`max_year` integer,
	`make` text,
	`min_price` integer,
	`max_price` integer,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `cars` ADD `discount_amount` integer;