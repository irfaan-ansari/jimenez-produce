import { relations } from "drizzle-orm";
import {
  account,
  customer,
  inventory,
  session,
  user,
  location,
  priceLevel,
  product,
  priceLevelItem,
  jobApplications,
  jobInvite,
  order,
  lineItem,
} from "./schema";

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

export const locationRelations = relations(location, ({ many }) => ({
  inventory: many(inventory),
}));

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
  priceLevel: one(priceLevel, {
    fields: [customer.priceLevelId],
    references: [priceLevel.id],
  }),
}));
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

export const productLevelRelation = relations(priceLevel, ({ many }) => ({
  priceLevelItem: many(priceLevelItem),
}));

export const priceLevelItemsRelations = relations(
  priceLevelItem,
  ({ one }) => ({
    priceLevel: one(priceLevel, {
      fields: [priceLevelItem.priceLevelId],
      references: [priceLevel.id],
    }),
    product: one(product, {
      fields: [priceLevelItem.productId],
      references: [product.id],
    }),
  })
);
export const applicantRelations = relations(jobApplications, ({ one }) => ({
  user: one(user, {
    fields: [jobApplications.reviewedBy],
    references: [user.id],
  }),
}));

export const jobInviteRelations = relations(jobInvite, ({ one }) => ({
  user: one(jobApplications, {
    fields: [jobInvite.applicationId],
    references: [jobApplications.id],
  }),
}));
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
