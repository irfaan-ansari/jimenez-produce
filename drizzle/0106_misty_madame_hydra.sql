CREATE TABLE "catalog" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"featured_product_ids" jsonb DEFAULT '[]'::jsonb,
	"effective_from" timestamp NOT NULL,
	"effective_to" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog_view" (
	"id" serial PRIMARY KEY NOT NULL,
	"catalog_id" integer NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"session_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "catalog" ADD CONSTRAINT "catalog_organization_id_team_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_view" ADD CONSTRAINT "catalog_view_catalog_id_catalog_id_fk" FOREIGN KEY ("catalog_id") REFERENCES "public"."catalog"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "catalog_organizationId_idx" ON "catalog" USING btree ("organization_id");