CREATE TABLE `sales` (
	`id` text PRIMARY KEY NOT NULL,
	`car_id` text NOT NULL,
	`lead_id` text,
	`buyer_name` text NOT NULL,
	`buyer_email` text NOT NULL,
	`buyer_phone` text NOT NULL,
	`sale_price` integer NOT NULL,
	`sold_at` text NOT NULL,
	FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `cars` ADD `status` text DEFAULT 'AVAILABLE' NOT NULL;