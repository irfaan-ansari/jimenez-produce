ALTER TABLE "catalog" DROP CONSTRAINT "catalog_organization_id_team_id_fk";
--> statement-breakpoint
ALTER TABLE "catalog" ADD CONSTRAINT "catalog_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;