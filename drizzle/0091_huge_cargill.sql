ALTER TABLE "order_guide_target" ALTER COLUMN "team_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_guide_target" ADD CONSTRAINT "order_guide_target_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_guide" DROP COLUMN "target";--> statement-breakpoint
ALTER TABLE "order_guide" DROP COLUMN "position";