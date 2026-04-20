ALTER TABLE "line_item" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "line_item" ADD CONSTRAINT "line_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lineItem_userId_idx" ON "line_item" USING btree ("user_id");