import { sql, InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  jsonb,
  serial,
  integer,
  date,
  unique,
} from "drizzle-orm/pg-core";
import { organization, session, team, user } from "./auth-schema";

/* -----------------------------
   Customers Table
----------------------------- */
export const customer = pgTable(
  "customer",
  {
    id: serial("id").primaryKey(),
    status: text("status").notNull().default("new"),
    thumbnail: text("thumbnail"),
    /* ---------------- Business Info ---------------- */
    companyName: text("company_name").notNull(),
    companyDBA: text("company_dba").notNull(),
    companyEin: text("company_ein").notNull(),
    companyStreet: text("company_street").notNull(),
    companyCity: text("company_city").notNull(),
    companyState: text("company_state").notNull(),
    companyZip: text("company_zip").notNull(),
    companyPhone: text("company_phone").notNull(),
    companyEmail: text("company_email").notNull(),
    companyType: text("company_type").notNull(),
    /* ---------------- Officer / Contact ---------------- */
    officerFirst: text("officer_first").notNull(),
    officerLast: text("officer_last").notNull(),
    officerRole: text("officer_title").notNull(),
    officerMobile: text("officer_mobile").notNull(),
    officerEmail: text("officer_email").notNull(),
    officerStreet: text("officer_street").notNull(),
    officerCity: text("officer_city").notNull(),
    officerState: text("officer_state").notNull(),
    officerZip: text("officer_zip").notNull(),

    /* ---------------- Additional Contact ---------------- */
    orderingName: text("ordering_name"),
    orderingPhone: text("ordering_phone"),
    accountPayableEmail: text("account_payable_email"),
    guarantorName: text("guarantor_name"),
    guarantorRole: text("guarantor_role"),
    salesRepresentative: text("sales_representative"),
    /* ---------------- Delivery ---------------- */
    lockboxPermission: text("lockbox_permission").notNull(),
    deliverySchedule: jsonb("delivery_schedule")
      .$type<
        {
          day: string;
          window: string;
          receivingName: string;
          receivingPhone: string;
          instructions: string;
        }[]
      >()
      .notNull(),
    /* ---------------- Authorization ---------------- */
    signatureName: text("signatureName").notNull(),
    acknowledge: boolean("acknowledge").notNull(),
    certificateUrl: text("certificate_url"),
    dlFrontUrl: text("dl_front_url"),
    dlBackUrl: text("dl_back_url"),
    signatureUrl: text("signature_url"),

    /* ---------------- Meta ---------------- */
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: text("user_id"),
    statusReason: text("status_reason"),
    statusDetails: text("status_details"),
    internalNotes: text("internal_notes"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("customer_status_idx").on(table.status),
    index("customer_created_at_idx").on(table.createdAt),
  ],
);
export const customerInvite = pgTable(
  "customer_invite",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone"),
    email: text("email").notNull(),
    companyName: text("company_name"),
    type: text("type"), // Invitation / Request
    companyType: text("company_type"),
    status: text("status").notNull().default("invited"), // new / applied / invited / approved / rejected / revoked
    message: text("message"),
    customerId: integer("customer_id").references(() => customer.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: text("reviewed_by"),
    statusReason: text("status_reason"),
    statusDetails: text("status_details"),
    internalNotes: text("internal_notes"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdBy: text("created_by"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("customer_invite_status_idx").on(table.status)],
);

export const jobApplications = pgTable(
  "job_applications",
  {
    id: serial("id").primaryKey(),
    position: text("position").notNull(),
    location: text("location"),
    declaration: boolean("declaration").notNull(),
    applicantName: text("applicant_name").notNull(),
    status: text("status").notNull().default("new"),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    dob: date("dob").notNull(),
    socialSecurity: text("social_security").notNull(),
    availableStartDate: date("available_start_date").notNull(),
    hasLegalRights: text("has_legal_rights").notNull(),
    currentAddress: jsonb("current_address")
      .$type<{
        street: string;
        city: string;
        state: string;
        zip: string;
        yearsAtAddress: string;
      }>()
      .notNull(),
    mailingAddress: jsonb("mailing_address")
      .$type<{
        street: string;
        city: string;
        state: string;
        zip: string;
        yearsAtAddress: string;
      }>()
      .notNull(),
    addresses: jsonb("addresses")
      .$type<
        {
          street: string;
          city: string;
          state: string;
          zip: string;
          yearsAtAddress: string;
        }[]
      >()
      .default([]),
    currentLicense: jsonb("current_license").$type<{
      state: string;
      licenseNumber: string;
      licenseType: string;
      endorsements: string;
      expiryDate: string;
    }>(),
    licenses: jsonb("licenses")
      .$type<
        {
          state: string;
          licenseNumber: string;
          licenseType: string;
          endorsements: string;
          expiryDate: string;
        }[]
      >()
      .default([]),
    drivingExperiences: jsonb("driving_experiences")
      .$type<
        {
          category: string;
          type: string;
          fromDate: string;
          toDate: string;
          approxMilesTotal: string;
        }[]
      >()
      .default([]),
    accidentHistory: jsonb("accident_history")
      .$type<
        {
          accidentDate: string;
          accidentNature: string;
          fatalitiesCount: string;
          injuriesCount: string;
          chemicalSpill: string;
        }[]
      >()
      .default([]),
    trafficConvictions: jsonb("traffic_convictions")
      .$type<
        {
          dateConvicted: string;
          violation: string;
          state: string;
          penalty: string;
          licenseDenied: string;
          licenseDeniedReason?: string;
          licenseSuspended?: string;
          licenseSuspendedReason?: string;
        }[]
      >()
      .default([]),
    /** Employement History */
    experience: jsonb("experience")
      .$type<
        {
          employerName: string;
          phone: string;
          address: string;
          position: string;
          fromDate: string;
          toDate: string;
          reasonForLeaving: string;
          salary: string;
          gap?: string;
          subjectToFmcsa: string;
          safetySensitive: string;
        }[]
      >()
      .default([]),
    /** Educations */
    highSchool: jsonb("high_school").$type<{
      institutionName: string;
      fieldOfStudy: string;
      location: string;
      yearCompleted: string;
      details?: string;
    }>(),
    collage: jsonb("collage").$type<{
      institutionName: string;
      fieldOfStudy: string;
      location: string;
      yearCompleted: string;
      details?: string;
    }>(),
    otherEducations: jsonb("other_educations")
      .$type<
        {
          institutionName: string;
          fieldOfStudy: string;
          location: string;
          yearCompleted: string;
          details?: string;
        }[]
      >()
      .default([]),
    /** Documents */
    drivingLicenseFrontUrl: text("driving_license_front_url").notNull(),
    drivingLicenseBackUrl: text("driving_license_back_url").notNull(),
    socialSecurityFrontUrl: text("social_security_front_url").notNull(),
    socialSecurityBackUrl: text("social_security_back_url").notNull(),
    dotFrontUrl: text("dot_front_url").notNull(),
    dotBackUrl: text("dot_back_url").notNull(),
    signatureUrl: text("signature_url").notNull(),
    cvUrl: text("cv_url").notNull(),
    agreementUrl: text("agreement_url"),
    agreementDate: text("agreement_date"),
    token: text("token"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    statusReason: text("status_reason"),
    statusDetails: text("status_details"),
    reviewedBy: text("reviewed_id"),
    reviewedAt: timestamp("reviewed_at"),
    internalNotes: text("internal_notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("job_application_position_idx").on(table.position),
    index("job_application_status_idx").on(table.status),
  ],
);

export const jobInvite = pgTable(
  "job_invite",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    position: text("position").notNull(),
    positionSlug: text("position_slug").notNull(),
    phone: text("phone"),
    email: text("email").notNull().unique(),
    status: text("status").notNull().default("invited"),
    message: text("message"),
    applicationId: integer("application_id").references(
      () => jobApplications.id,
      {
        onDelete: "set null",
      },
    ),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("job_invite_status_idx").on(table.status)],
);

/* -----------------------------
   Product Table
----------------------------- */
export const product = pgTable(
  "product",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "cascade",
    }),
    identifier: text("identifier").notNull(),
    type: text("type"),
    pack: text("pack"),
    description: text("description"),
    categories: jsonb("categories")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),
    status: text("status").default("active"),
    image: text("image"),
    basePrice: text("base_price").notNull().default("0"),
    unit: text("unit"),
    images: jsonb("images")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),
    isTaxable: boolean("is_taxable").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("products_status_idx").on(table.status),
    index("products_organization_id_idx").on(table.organizationId),
    index("products_category_idx").on(table.categories),
    unique("products_organization_id_identifier_idx").on(
      table.organizationId,
      table.identifier,
    ),
  ],
);

export const priceLevel = pgTable("price_level", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  adjustmentType: text("adjustment_type").notNull(), // "fixed" | "percentage"
  appliesTo: text("applies_to").default("all").notNull(), // "all" | "products"
  adjustmentValue: text("adjustment_value"), // +10, -10, 50 etc
  status: text("status").default("active"), // "active" | "inactive"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/* -----------------------------
   price level items
----------------------------- */
export const priceLevelItem = pgTable(
  "price_level_item",
  {
    id: serial("id").primaryKey(),
    priceLevelId: integer("price_level_id").notNull(),
    productId: integer("product_id")
      .notNull()
      .references(() => product.id, {
        onDelete: "cascade",
      }),
    price: text("price").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("price_level_item_priceLevelId_idx").on(table.priceLevelId),
    index("price_level_item_productId_idx").on(table.productId),
    unique("price_level_product_unique").on(
      table.priceLevelId,
      table.productId,
    ),
  ],
);

/* -----------------------------
   Tax Rules
----------------------------- */
export const taxRule = pgTable("tax_rule", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  rate: text("rate").notNull(),
  priority: integer("priority").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/* -----------------------------
   Tax Rules Items
----------------------------- */
export const taxRuleItem = pgTable(
  "tax_rule_item",
  {
    id: serial("id").primaryKey(),
    taxRuleId: integer("tax_rule_id").references(() => taxRule.id, {
      onDelete: "cascade",
    }),
    teamId: text("team_id").references(() => team.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("tax_rule_item_taxRuleId_idx").on(table.taxRuleId),
    index("tax_rule_item_teamId_idx").on(table.teamId),
    unique("tax_rule_item_team_tax_rule_unique").on(
      table.teamId,
      table.taxRuleId,
    ),
  ],
);

/* -----------------------------
   order guide
----------------------------- */
export const orderGuideItem = pgTable(
  "order_guide_item",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id").notNull(),
    teamId: text("team_id"),
    quantity: text("quantity"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("order_guide_item_productId_idx").on(table.productId),
    unique("order_guide_item_team_product_unique").on(
      table.teamId,
      table.productId,
    ),
  ],
);

export const order = pgTable(
  "order",
  {
    id: serial("id").primaryKey(),
    organizationId: text("organization_id"),
    teamId: text("team_id"),
    userId: text("user_id"),
    shippingAddress: jsonb("shipping_address").$type<{
      street: string;
      city: string;
      state: string;
      zip: string;
    }>(),
    lineItemCount: text("line_item_count"),
    lineItemQuantity: text("line_item_quantity"),
    lineItemTotal: text("line_item_total"),
    subtotal: text("subtotal").notNull(),
    taxableSubtotal: text("taxable_subtotal").notNull().default("0"),
    nonTaxableSubtotal: text("non_taxable_subtotal").notNull().default("0"),
    discount: text("discount").default("0").notNull(),
    taxName: text("tax_name"),
    taxRate: text("tax_rate"),
    tax: text("tax").default("0").notNull(),
    charges: jsonb("charges").$type<{
      type: string;
      amount: string;
    }>(),
    total: text("total").default("0").notNull(),
    po: text(""),
    notes: text("notes"),
    deliveryDate: text("delivery_date"),
    deliveryWindow: text("delivery_window"),
    deliveryInstruction: text("delivery_instruction"),
    status: text("status").default("in_progress") /* active | completed */,
    paymentStatus: text("payment_status"),
    deliveredAt: timestamp("delivered_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("order_organizationId_idx").on(table.organizationId),
    index("order_teamId_idx").on(table.teamId),
    index("order_status_idx").on(table.status),
    index("order_userId_idx").on(table.userId),
  ],
);

export const lineItem = pgTable(
  "line_item",
  {
    id: serial("id").primaryKey(),
    organizationId: text("organization_id"),
    teamId: text("team_id"),
    orderId: integer("order_id"),
    productId: integer("product_id"),
    title: text("title"),
    image: text("image"),
    type: text("type"),
    identifier: text("identifier"),
    pack: text("pack"),
    categories: jsonb("categories")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),
    price: text("price"),
    quantity: text("quantity"),
    subtotal: text("subtotal").default("0"),
    isTaxable: boolean("is_taxable").default(false),
    taxAmount: text("tax_amount").default("0"),
    total: text("total").default("0"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("lineItem_organizationId_idx").on(table.organizationId),
    index("lineItem_teamId_idx").on(table.teamId),
  ],
);

export type ProductInsertType = InferInsertModel<typeof product>;
export type ProductSelectType = InferSelectModel<typeof product>;
export type CustomerSelectType = InferSelectModel<typeof customer>;
export type CustomerInsertType = InferInsertModel<typeof customer>;

export type UserInsertType = InferInsertModel<typeof user>;
export type UserSelectType = InferSelectModel<typeof user>;
export type SessionInsertType = InferInsertModel<typeof session>;
export type SessionSelectType = InferSelectModel<typeof session>;

export type CustomerInviteInsertType = InferInsertModel<typeof customerInvite>;
export type CustomerInviteSelectType = InferSelectModel<typeof customerInvite>;

export type JobApplicationInsertType = InferInsertModel<typeof jobApplications>;
export type JobApplicationSelectType = InferSelectModel<typeof jobApplications>;

export type JobInviteInsertType = InferInsertModel<typeof jobInvite>;
export type JobInviteSelectType = InferSelectModel<typeof jobInvite>;

export type PriceLevelInsertType = InferInsertModel<typeof priceLevel>;
export type PriceLevelSelectType = InferSelectModel<typeof priceLevel>;

export type PriceLevelItemInsertType = InferInsertModel<typeof priceLevelItem>;
export type PriceLevelItemSelectType = InferSelectModel<typeof priceLevelItem>;

export type OrderSelectType = InferSelectModel<typeof order>;
export type OrderInsertType = InferInsertModel<typeof order>;
export type LineItemSelectType = InferSelectModel<typeof lineItem>;
export type LineItemInsertType = InferInsertModel<typeof lineItem>;

export type OrderGuideItemInsertType = InferInsertModel<typeof orderGuideItem>;
export type OrderGuideItemSelectType = InferSelectModel<typeof orderGuideItem>;

export type OrganizationSelectType = InferSelectModel<typeof organization>;
export type OrganizationInsertType = InferInsertModel<typeof organization>;

export type TeamSelectType = InferSelectModel<typeof team>;
export type TeamInsertType = InferInsertModel<typeof team>;

export type TaxRuleSelectType = InferSelectModel<typeof taxRule>;
export type TaxRuleInsertType = InferInsertModel<typeof taxRule>;

export type TaxRuleItemSelectType = InferSelectModel<typeof taxRuleItem>;
export type TaxRuleItemInsertType = InferInsertModel<typeof taxRuleItem>;
