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
  unique,
} from "drizzle-orm/pg-core";
import { on } from "events";

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
   Location Table
----------------------------- */
export const location = pgTable("location", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  address: jsonb("address").$type<{
    street: string;
    city: string;
    state: string;
    zip: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type LocationSelectType = InferSelectModel<typeof location>;
export type LocationInsertType = InferInsertModel<typeof location>;

export const locationRelations = relations(location, ({ many }) => ({
  inventory: many(inventory),
}));

/* -----------------------------
   Customers Table
----------------------------- */
export const customer = pgTable(
  "customer",
  {
    id: serial("id").primaryKey(),
    status: text("status").notNull().default("new"),
    thumbnail: text("thumbnail"),
    locationId: integer("location_id"),
    accountId: text("account_id"),
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
  reviewer: one(user, {
    fields: [customer.reviewedBy],
    references: [user.id],
  }),
  account: one(user, {
    fields: [customer.accountId],
    references: [user.id],
  }),
  location: one(location, {
    fields: [customer.locationId],
    references: [location.id],
  }),
}));

export type CustomerSelectType = InferSelectModel<typeof customer>;
export type CustomerInsertType = InferInsertModel<typeof customer>;

/* -----------------------------
   Product Table
----------------------------- */
export const product = pgTable(
  "product",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    identifier: text("identifier").unique().notNull(),
    type: text("type"),
    pack: text("pack"),
    description: text("description"),
    categories: jsonb("categories")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),
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

/* -----------------------------
   Inventory Table
----------------------------- */
export const inventory = pgTable(
  "inventory",
  {
    id: serial("id").primaryKey(),
    locationId: integer("location_id")
      .notNull()
      .references(() => location.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    price: text("price"),
    offerPrice: text("offer_price"),
    stock: text("stock"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("product_locationId_idx").on(table.locationId),
    index("product_productId_idx").on(table.productId),
    unique("inventory_product_location_unique").on(
      table.productId,
      table.locationId
    ),
  ]
);

export const productRelation = relations(product, ({ many }) => ({
  inventory: many(inventory),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(product, {
    fields: [inventory.productId],
    references: [product.id],
  }),
  location: one(location, {
    fields: [inventory.locationId],
    references: [location.id],
  }),
}));

export type InventoryInsertType = InferInsertModel<typeof inventory>;
export type InventorySelectType = InferSelectModel<typeof inventory>;

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
    reviewedBy: text("reviewed_by").references(() => user.id, {
      onDelete: "set null",
    }),
    statusReason: text("status_reason"),
    statusDetails: text("status_details"),
    internalNotes: text("internal_notes"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdBy: text("created_by").references(() => user.id, {
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
      }
    ),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("job_invite_status_idx").on(table.status)]
);

export const jobInviteRelations = relations(jobInvite, ({ one }) => ({
  user: one(jobApplications, {
    fields: [jobInvite.applicationId],
    references: [jobApplications.id],
  }),
}));

export type JobInviteInsertType = InferInsertModel<typeof jobInvite>;
export type JobInviteSelectType = InferSelectModel<typeof jobInvite>;

export const order = pgTable(
  "order",
  {
    id: serial("id").primaryKey(),
    locationId: integer("location_id").references(() => location.id, {
      onDelete: "set null",
    }),
    customerId: integer("customer_id").references(() => customer.id, {
      onDelete: "set null",
    }),
    driverId: integer("driver_id").references(() => jobApplications.id, {
      onDelete: "set null",
    }),
    shippingAddress: jsonb("shipping_address").$type<{
      street: string;
      city: string;
      state: string;
      zip: string;
    }>(),
    receiverName: text("receiver_name"),
    receiverPhone: text("receiver_phone"),
    lineItemCount: text("line_item_count"),
    lineItemQuantity: text("line_item_quantity"),
    lineItemTotal: text("line_item_total"),
    subtotal: text("subtotal").notNull(),
    discount: text("discount").default("0").notNull(),
    tax: text("tax").default("0").notNull(),
    total: text("total").default("0").notNull(),
    po: text(""),
    notes: text("notes"),
    deliveryDate: text("delivery_date"),
    deliveryWindow: text("delivery_window"),
    deliveryInstruction: text("delivery_instruction"),
    status: text("status").default("active") /* active | completed */,
    paymentStatus: text("payment_status"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("order_locationId_idx").on(table.locationId),
    index("order_customerId_idx").on(table.customerId),
  ]
);

export const orderRelations = relations(order, ({ one, many }) => ({
  driver: one(jobApplications, {
    fields: [order.driverId],
    references: [jobApplications.id],
  }),
  location: one(location, {
    fields: [order.locationId],
    references: [location.id],
  }),
  customer: one(customer, {
    fields: [order.customerId],
    references: [customer.id],
  }),
  lineItems: many(lineItem),
}));

export type OrderSelectType = InferSelectModel<typeof order>;
export type OrderInsertType = InferInsertModel<typeof order>;

export const lineItem = pgTable(
  "line_item",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id"),
    productId: integer("product_id"),
    locationId: integer("location_id"),
    customerId: integer("customer_id"),
    title: text("title"),
    image: text("image"),
    type: text("type"),
    identifier: text("identifier"),
    pack: text("pack"),
    categories: jsonb("categories")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),
    price: text("price"),
    offerPrice: text("offer_price"),
    quantity: text("quantity"),
    total: text("total"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("lineItem_locationId_idx").on(table.locationId),
    index("lineItem_customerId_idx").on(table.customerId),
  ]
);

export const lineItemRelations = relations(lineItem, ({ one }) => ({
  order: one(order, {
    fields: [lineItem.orderId],
    references: [order.id],
  }),
  location: one(location, {
    fields: [lineItem.locationId],
    references: [location.id],
  }),
  customer: one(customer, {
    fields: [lineItem.customerId],
    references: [customer.id],
  }),
}));

export type LineItemSelectType = InferSelectModel<typeof lineItem>;
export type LineItemInsertType = InferInsertModel<typeof lineItem>;
