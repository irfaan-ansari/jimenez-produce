CREATE TABLE "order_guide" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"team_id" text,
	"name" text NOT NULL,
	"description" text,
	"visibility" text DEFAULT 'personal' NOT NULL,
	"type" text DEFAULT 'custom' NOT NULL,
	"target" text DEFAULT 'all' NOT NULL,
	"created_by" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_guide_targets" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_guide_id" integer,
	"team_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_guide_item" RENAME COLUMN "team_id" TO "order_guide_id";--> statement-breakpoint
ALTER TABLE "order_guide_item" DROP CONSTRAINT "order_guide_item_team_product_unique";--> statement-breakpoint
ALTER TABLE "order_guide_item" ALTER COLUMN "product_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_guide_item" ADD COLUMN "position" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "order_guide" ADD CONSTRAINT "order_guide_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_guide" ADD CONSTRAINT "order_guide_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_guide" ADD CONSTRAINT "order_guide_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_guide_targets" ADD CONSTRAINT "order_guide_targets_order_guide_id_order_guide_id_fk" FOREIGN KEY ("order_guide_id") REFERENCES "public"."order_guide"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_guides_team_idx" ON "order_guide" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "order_guides_organization_id_idx" ON "order_guide" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "order_guide_targets_guide_idx" ON "order_guide_targets" USING btree ("order_guide_id");--> statement-breakpoint
ALTER TABLE "order_guide_item" ADD CONSTRAINT "order_guide_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_guide_item" ADD CONSTRAINT "order_guide_item_order_guide_id_order_guide_id_fk" FOREIGN KEY ("order_guide_id") REFERENCES "public"."order_guide"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_guide_item_order_guide_id_idx" ON "order_guide_item" USING btree ("order_guide_id");--> statement-breakpoint
ALTER TABLE "order_guide_item" ADD CONSTRAINT "order_guide_item_orderGuide_product_unique" UNIQUE("order_guide_id","product_id");