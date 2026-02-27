CREATE TABLE "catalog_access" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"business_name" text NOT NULL,
	"business_type" text,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "job-post" CASCADE;--> statement-breakpoint
CREATE INDEX "catalog_access_status_idx" ON "catalog_access" USING btree ("status");