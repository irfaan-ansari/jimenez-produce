import { relations } from "drizzle-orm";
import {
  account,
  customer,
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
  orderGuideItem,
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

export const customerRelations = relations(customer, ({ one }) => ({
  reviewer: one(user, {
    fields: [customer.reviewedBy],
    references: [user.id],
  }),
}));

export const productRelations = relations(product, ({ one }) => ({
  location: one(location, {
    fields: [product.locationId],
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
  }),
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
  location: one(location, {
    fields: [order.locationId],
    references: [location.id],
  }),
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
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
  user: one(user, {
    fields: [lineItem.userId],
    references: [user.id],
  }),
}));

export const orderGuideItemRelations = relations(orderGuideItem, ({ one }) => ({
  user: one(user, {
    fields: [orderGuideItem.userId],
    references: [user.id],
  }),
  product: one(product, {
    fields: [orderGuideItem.productId],
    references: [product.id],
  }),
}));
