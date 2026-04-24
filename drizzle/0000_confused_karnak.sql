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
	"type" text,
	"company_type" text,
	"status" text DEFAULT 'invited' NOT NULL,
	"message" text,
	"customer_id" integer,
	"reviewed_at" timestamp,
	"reviewed_by" text,
	"status_reason" text,
	"status_details" text,
	"internal_notes" text,
	"ip_address" text,
	"user_agent" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"team_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" text NOT NULL,
	"location" text,
	"declaration" boolean NOT NULL,
	"applicant_name" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"dob" date NOT NULL,
	"social_security" text NOT NULL,
	"available_start_date" date NOT NULL,
	"has_legal_rights" text NOT NULL,
	"current_address" jsonb NOT NULL,
	"mailing_address" jsonb NOT NULL,
	"addresses" jsonb DEFAULT '[]'::jsonb,
	"current_license" jsonb,
	"licenses" jsonb DEFAULT '[]'::jsonb,
	"driving_experiences" jsonb DEFAULT '[]'::jsonb,
	"accident_history" jsonb DEFAULT '[]'::jsonb,
	"traffic_convictions" jsonb DEFAULT '[]'::jsonb,
	"experience" jsonb DEFAULT '[]'::jsonb,
	"high_school" jsonb,
	"collage" jsonb,
	"other_educations" jsonb DEFAULT '[]'::jsonb,
	"driving_license_front_url" text NOT NULL,
	"driving_license_back_url" text NOT NULL,
	"social_security_front_url" text NOT NULL,
	"social_security_back_url" text NOT NULL,
	"dot_front_url" text NOT NULL,
	"dot_back_url" text NOT NULL,
	"signature_url" text NOT NULL,
	"cv_url" text NOT NULL,
	"agreement_url" text,
	"agreement_date" text,
	"token" text,
	"ip_address" text,
	"user_agent" text,
	"status_reason" text,
	"status_details" text,
	"reviewed_id" text,
	"reviewed_at" timestamp,
	"internal_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_invite" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"position" text NOT NULL,
	"position_slug" text NOT NULL,
	"phone" text,
	"email" text NOT NULL,
	"status" text DEFAULT 'invited' NOT NULL,
	"message" text,
	"application_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "job_invite_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "line_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"product_id" integer,
	"location_id" integer,
	"user_id" text,
	"title" text,
	"image" text,
	"type" text,
	"identifier" text,
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
CREATE TABLE "location" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"address" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"location_id" integer,
	"user_id" text,
	"shipping_address" jsonb,
	"receiver_name" text,
	"receiver_phone" text,
	"line_item_count" text,
	"line_item_quantity" text,
	"line_item_total" text,
	"subtotal" text NOT NULL,
	"discount" text DEFAULT '0' NOT NULL,
	"tax" text DEFAULT '0' NOT NULL,
	"charges" jsonb,
	"total" text DEFAULT '0' NOT NULL,
	"po" text,
	"notes" text,
	"delivery_date" text,
	"delivery_window" text,
	"delivery_instruction" text,
	"status" text DEFAULT 'active',
	"payment_status" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_guide_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" text,
	"quantity" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "order_guide_item_user_product_unique" UNIQUE("user_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "price_level" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"scope" text DEFAULT 'all' NOT NULL,
	"value" integer,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_level_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"price_level_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"type" text NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "price_level_product_unique" UNIQUE("price_level_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"location_id" integer,
	"identifier" text NOT NULL,
	"type" text,
	"pack" text,
	"description" text,
	"categories" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'active',
	"image" text,
	"base_price" text DEFAULT '0' NOT NULL,
	"unit" text,
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
	"active_organization_id" text,
	"active_team_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"organization_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "team_member" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp
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
	"phone_number" text,
	"phone_number_verified" boolean,
	"is_super_admin" boolean DEFAULT false,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
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
ALTER TABLE "customer_invite" ADD CONSTRAINT "customer_invite_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_invite" ADD CONSTRAINT "customer_invite_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_reviewed_id_user_id_fk" FOREIGN KEY ("reviewed_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_invite" ADD CONSTRAINT "job_invite_application_id_job_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."job_applications"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line_item" ADD CONSTRAINT "line_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_guide_item" ADD CONSTRAINT "order_guide_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "customer_status_idx" ON "customer" USING btree ("status");--> statement-breakpoint
CREATE INDEX "customer_created_at_idx" ON "customer" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "customer_invite_status_idx" ON "customer_invite" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invitation_organizationId_idx" ON "invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "job_application_position_idx" ON "job_applications" USING btree ("position");--> statement-breakpoint
CREATE INDEX "job_application_status_idx" ON "job_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "job_invite_status_idx" ON "job_invite" USING btree ("status");--> statement-breakpoint
CREATE INDEX "lineItem_locationId_idx" ON "line_item" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "lineItem_userId_idx" ON "line_item" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_organizationId_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "member_userId_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "order_locationId_idx" ON "order" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "order_guide_item_productId_idx" ON "order_guide_item" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_uidx" ON "organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "price_level_item_priceLevelId_idx" ON "price_level_item" USING btree ("price_level_id");--> statement-breakpoint
CREATE INDEX "price_level_item_productId_idx" ON "price_level_item" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "product" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "product" USING btree ("categories");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "team_organizationId_idx" ON "team" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "teamMember_teamId_idx" ON "team_member" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "teamMember_userId_idx" ON "team_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");