CREATE TABLE "job_invite" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"email" text NOT NULL,
	"status" text DEFAULT 'invited' NOT NULL,
	"message" text,
	"application_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "job_invite_email_unique" UNIQUE("email")
);

ALTER TABLE "job_invite" ADD CONSTRAINT "job_invite_application_id_job_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."job_applications"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "job_invite_status_idx" ON "job_invite" USING btree ("status");