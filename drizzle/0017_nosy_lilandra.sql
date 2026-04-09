CREATE TABLE "line_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"location_id" integer,
	"customer_id" integer,
	"title" text,
	"type" text,
	"code" text,
	"pack" text,
	"categories" jsonb DEFAULT '[]'::jsonb,
	"price" text,
	"offer_price" text,
	"quantity" text,
	"total" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"location_id" integer,
	"customer_id" integer,
	"driver_id" integer,
	"shippingAddress" jsonb,
	"receiverName" text,
	"receiverPhone" text,
	"lineItemCount" text,
	"lineItemQuantity" text,
	"subtotal" text NOT NULL,
	"discount" text DEFAULT '0' NOT NULL,
	"tax" text DEFAULT '0' NOT NULL,
	"notes" text,
	"deliveryDate" timestamp,
	"deliveryWindow" text,
	"deliveryInstruction" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "pack" text;--> statement-breakpoint
ALTER TABLE "line_item" ADD CONSTRAINT "line_item_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_item" ADD CONSTRAINT "line_item_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_item" ADD CONSTRAINT "line_item_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_driver_id_job_applications_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."job_applications"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lineItem_locationId_idx" ON "line_item" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "lineItem_customerId_idx" ON "line_item" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "order_locationId_idx" ON "order" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "order_customerId_idx" ON "order" USING btree ("customer_id");