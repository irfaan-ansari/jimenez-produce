CREATE TABLE "tax_rule" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text,
	"name" text NOT NULL,
	"rate" text NOT NULL,
	"priority" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tax_rule_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"tax_rule_id" integer,
	"team_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tax_rule_item_team_tax_rule_unique" UNIQUE("team_id","tax_rule_id")
);
--> statement-breakpoint
ALTER TABLE "tax_rule" ADD CONSTRAINT "tax_rule_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_rule_item" ADD CONSTRAINT "tax_rule_item_tax_rule_id_tax_rule_id_fk" FOREIGN KEY ("tax_rule_id") REFERENCES "public"."tax_rule"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_rule_item" ADD CONSTRAINT "tax_rule_item_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tax_rule_item_taxRuleId_idx" ON "tax_rule_item" USING btree ("tax_rule_id");--> statement-breakpoint
CREATE INDEX "tax_rule_item_teamId_idx" ON "tax_rule_item" USING btree ("team_id");