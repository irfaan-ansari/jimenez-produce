CREATE TABLE "job-post" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"responsibility" text,
	"categories" jsonb DEFAULT '[]'::jsonb,
	"form" text DEFAULT 'driver' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "job_post_status_idx" ON "job-post" USING btree ("status");