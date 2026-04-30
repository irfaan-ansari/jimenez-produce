CREATE TABLE "team_product" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" text,
	"product_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_product_unique" UNIQUE("team_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "team_product" ADD CONSTRAINT "team_product_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_product" ADD CONSTRAINT "team_product_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "team_product_teamId_idx" ON "team_product" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "team_product_productId_idx" ON "team_product" USING btree ("product_id");