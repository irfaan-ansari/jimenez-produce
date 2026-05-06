ALTER TABLE "order_guide_targets" RENAME TO "order_guide_target";--> statement-breakpoint
ALTER TABLE "order_guide_target" DROP CONSTRAINT "order_guide_targets_order_guide_id_order_guide_id_fk";
--> statement-breakpoint
ALTER TABLE "order_guide" ALTER COLUMN "target" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "order_guide" ALTER COLUMN "target" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_guide_target" ADD CONSTRAINT "order_guide_target_order_guide_id_order_guide_id_fk" FOREIGN KEY ("order_guide_id") REFERENCES "public"."order_guide"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_guide_targets_team_idx" ON "order_guide_target" USING btree ("team_id");--> statement-breakpoint
ALTER TABLE "order_guide_target" ADD CONSTRAINT "order_guide_targets_guide_team_unique" UNIQUE("order_guide_id","team_id");