ALTER TABLE "order" DROP CONSTRAINT "order_driver_id_job_applications_id_fk";
--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "driver_id";