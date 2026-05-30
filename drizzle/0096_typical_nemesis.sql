CREATE TABLE "promotion" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text,
	"title" text,
	"description" text,
	"image" text,
	"video" text,
	"badge" text,
	"target" text DEFAULT 'all' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotion_target" (
	"id" serial PRIMARY KEY NOT NULL,
	"promotion_id" integer NOT NULL,
	"team_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "promotion_target_promotion_team_unique" UNIQUE("promotion_id","team_id")
);
--> statement-breakpoint
ALTER TABLE "promotion" ADD CONSTRAINT "promotion_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_target" ADD CONSTRAINT "promotion_target_promotion_id_promotion_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotion"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_target" ADD CONSTRAINT "promotion_target_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "promotion_organizationId_idx" ON "promotion" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "promotion_target_promotionId_idx" ON "promotion_target" USING btree ("promotion_id");--> statement-breakpoint
CREATE INDEX "promotion_target_teamId_idx" ON "promotion_target" USING btree ("team_id");