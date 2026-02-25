CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"thumbnail" text,
	"company_name" text NOT NULL,
	"company_dba" text NOT NULL,
	"company_ein" text NOT NULL,
	"company_street" text NOT NULL,
	"company_city" text NOT NULL,
	"company_state" text NOT NULL,
	"company_zip" text NOT NULL,
	"company_phone" text NOT NULL,
	"company_email" text NOT NULL,
	"company_type" text NOT NULL,
	"officer_first" text NOT NULL,
	"officer_last" text NOT NULL,
	"officer_title" text NOT NULL,
	"officer_mobile" text NOT NULL,
	"officer_email" text NOT NULL,
	"officer_street" text NOT NULL,
	"officer_city" text NOT NULL,
	"officer_state" text NOT NULL,
	"officer_zip" text NOT NULL,
	"ordering_name" text,
	"ordering_phone" text,
	"account_payable_email" text,
	"guarantor_name" text,
	"guarantor_role" text,
	"sales_representative" text,
	"lockbox_permission" text NOT NULL,
	"delivery_schedule" jsonb NOT NULL,
	"signatureName" text NOT NULL,
	"acknowledge" boolean NOT NULL,
	"certificate_url" text,
	"dl_front_url" text,
	"dl_back_url" text,
	"signature_url" text,
	"reviewed_at" timestamp,
	"user_id" text,
	"status_reason" text,
	"status_details" text,
	"internal_notes" text,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_invite" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"email" text NOT NULL,
	"company_name" text,
	"company_type" text,
	"status" text DEFAULT 'invited' NOT NULL,
	"customer_id" integer,
	"created_by" text,
	"status_updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customer_invite_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"identifier" text,
	"description" text,
	"categories" jsonb DEFAULT '[]'::jsonb,
	"price" text,
	"offer_price" text,
	"status" text DEFAULT 'active',
	"image" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_invite" ADD CONSTRAINT "customer_invite_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_invite" ADD CONSTRAINT "customer_invite_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_invite" ADD CONSTRAINT "customer_invite_status_updated_by_user_id_fk" FOREIGN KEY ("status_updated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "customer_status_idx" ON "customer" USING btree ("status");--> statement-breakpoint
CREATE INDEX "customer_created_at_idx" ON "customer" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "product" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "product" USING btree ("categories");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");