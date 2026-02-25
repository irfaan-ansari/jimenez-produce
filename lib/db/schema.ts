import {
  InferInsertModel,
  InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";
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
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export type UserInsertType = InferInsertModel<typeof user>;
export type UserSelectType = InferSelectModel<typeof user>;
export type SessionInsertType = InferInsertModel<typeof session>;
export type SessionSelectType = InferSelectModel<typeof session>;

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
    reviewedBy: text("user_id").references(() => user.id, {
      onDelete: "set null",
    }),
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
  ]
);

export const customerRelations = relations(customer, ({ one }) => ({
  user: one(user, {
    fields: [customer.reviewedBy],
    references: [user.id],
  }),
}));
export type CustomerSelectType = InferSelectModel<typeof customer>;
export type CustomerInsertType = InferInsertModel<typeof customer>;

export const product = pgTable(
  "product",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    identifier: text("identifier"),
    description: text("description"),
    categories: jsonb("categories")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),
    price: text("price"),
    offerPrice: text("offer_price"),
    status: text("status").default("active"),
    image: text("image"),
    images: jsonb("images")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("products_status_idx").on(table.status),
    index("products_category_idx").on(table.categories),
  ]
);

export type ProductInsertType = InferInsertModel<typeof product>;
export type ProductSelectType = InferSelectModel<typeof product>;

export const customerInvite = pgTable(
  "customer_invite",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone"),
    email: text("email").notNull().unique(),
    companyName: text("company_name"),
    companyType: text("company_type"),
    status: text("status").notNull().default("invited"), // applied/ invited / converted / rejected
    message: text("message"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    customerId: integer("customer_id").references(() => customer.id, {
      onDelete: "set null",
    }),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    statusUpdateBy: text("status_updated_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("customer_invite_status_idx").on(table.status)]
);

export const customerInviteRelations = relations(customerInvite, ({ one }) => ({
  user: one(customer, {
    fields: [customerInvite.customerId],
    references: [customer.id],
  }),
}));

export type CustomerInviteInsertType = InferInsertModel<typeof customerInvite>;
export type CustomerInviteSelectType = InferSelectModel<typeof customerInvite>;

export const jobApplications = pgTable(
  "job_applications",
  {
    id: serial("id").primaryKey(),
    position: text("position").notNull(),
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
    agreementUrl: text("agreement_url"),
    agreementDate: text("agreement_date"),
    agreementSignatureUrl: text("agreement_signature_url"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    statusReason: text("status_reason"),
    statusDetails: text("status_details"),
    reviewedBy: text("reviewed_id").references(() => user.id, {
      onDelete: "set null",
    }),
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
  ]
);

export const applicantRelations = relations(jobApplications, ({ one }) => ({
  user: one(user, {
    fields: [jobApplications.reviewedBy],
    references: [user.id],
  }),
}));

export type JobApplicationInsertType = InferInsertModel<typeof jobApplications>;
export type JobApplicationSelectType = InferSelectModel<typeof jobApplications>;

export const jobPost = pgTable(
  "job-post",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    responsibility: text("responsibility"),
    categories: jsonb("categories").$type<string[]>().default([]),
    form: text("form").notNull().default("driver"),
    status: text("status").notNull().default("draft"), // draft / new /
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("job_post_status_idx").on(table.status)]
);

export type JobPostInsertType = InferInsertModel<typeof jobPost>;
export type JobPostSelectType = InferSelectModel<typeof jobPost>;
