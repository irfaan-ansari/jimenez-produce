import { relations } from "drizzle-orm";
import {
  customer,
  priceLevel,
  product,
  priceLevelItem,
  jobApplications,
  jobInvite,
  order,
  lineItem,
  customerInvite,
  orderGuideItem,
  taxRule,
  taxRuleItem,
  teamProduct,
  orderGuide,
  orderGuideTarget,
  promotion,
  promotionTarget,
  catalog,
  catalogView,
  messageRecipients,
  messages,
} from "./schema";

import {
  account,
  session,
  user,
  invitation,
  organization,
  member,
  teamMember,
  team,
} from "./auth-schema";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  teamMembers: many(teamMember),
  members: many(member),
  invitations: many(invitation),
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

export const organizationRelations = relations(organization, ({ many }) => ({
  teams: many(team),
  members: many(member),
  invitations: many(invitation),
  taxRules: many(taxRule),
}));

export const teamRelations = relations(team, ({ one, many }) => ({
  organization: one(organization, {
    fields: [team.organizationId],
    references: [organization.id],
  }),
  teamMembers: many(teamMember),
  priceLevel: one(priceLevel, {
    fields: [team.priceLevelId],
    references: [priceLevel.id],
  }),
  taxRule: one(taxRule, {
    fields: [team.taxRuleId],
    references: [taxRule.id],
  }),
  products: many(teamProduct),
}));

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
  team: one(team, {
    fields: [teamMember.teamId],
    references: [team.id],
  }),
  user: one(user, {
    fields: [teamMember.userId],
    references: [user.id],
  }),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));

/**
 * app relations
 *
 */

export const customerRelations = relations(customer, ({ one }) => ({
  reviewer: one(user, {
    fields: [customer.reviewedBy],
    references: [user.id],
  }),
}));

export const customerInviteRelations = relations(customerInvite, ({ one }) => ({
  user: one(customer, {
    fields: [customerInvite.customerId],
    references: [customer.id],
  }),
}));

export const productRelations = relations(product, ({ many }) => ({
  lineItems: many(lineItem),
  orderGuideItems: many(orderGuideItem),
}));

export const priceLevelRelation = relations(priceLevel, ({ one, many }) => ({
  priceLevelItem: many(priceLevelItem),
  organization: one(organization, {
    fields: [priceLevel.organizationId],
    references: [organization.id],
  }),
  team: many(team),
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

export const teamProductRelations = relations(teamProduct, ({ one }) => ({
  team: one(team, {
    fields: [teamProduct.teamId],
    references: [team.id],
  }),
  product: one(product, {
    fields: [teamProduct.productId],
    references: [product.id],
  }),
}));

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
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [order.organizationId],
    references: [organization.id],
  }),
  team: one(team, {
    fields: [order.teamId],
    references: [team.id],
  }),
  lineItems: many(lineItem),
}));

export const lineItemRelations = relations(lineItem, ({ one, many }) => ({
  order: one(order, {
    fields: [lineItem.orderId],
    references: [order.id],
  }),
  organization: one(organization, {
    fields: [lineItem.organizationId],
    references: [organization.id],
  }),
  team: one(team, {
    fields: [lineItem.teamId],
    references: [team.id],
  }),
  product: one(product, {
    fields: [lineItem.productId],
    references: [product.id],
  }),
}));

export const orderGuideRelations = relations(orderGuide, ({ one, many }) => ({
  organization: one(organization, {
    fields: [orderGuide.organizationId],
    references: [organization.id],
  }),
  team: one(team, {
    fields: [orderGuide.teamId],
    references: [team.id],
  }),
  orderGuideItems: many(orderGuideItem),
  orderGuideTargets: many(orderGuideTarget),
}));

export const orderGuideItemRelations = relations(orderGuideItem, ({ one }) => ({
  orderGuide: one(orderGuide, {
    fields: [orderGuideItem.orderGuideId],
    references: [orderGuide.id],
  }),
  product: one(product, {
    fields: [orderGuideItem.productId],
    references: [product.id],
  }),
}));

export const orderGuideTargetRelations = relations(
  orderGuideTarget,
  ({ one }) => ({
    orderGuide: one(orderGuide, {
      fields: [orderGuideTarget.orderGuideId],
      references: [orderGuide.id],
    }),
    team: one(team, {
      fields: [orderGuideTarget.teamId],
      references: [team.id],
    }),
  }),
);

export const taxRuleRelations = relations(taxRule, ({ one, many }) => ({
  organization: one(organization, {
    fields: [taxRule.organizationId],
    references: [organization.id],
  }),
}));

export const promotionRelations = relations(promotion, ({ one, many }) => ({
  organization: one(organization, {
    fields: [promotion.organizationId],
    references: [organization.id],
  }),
  promotionTargets: many(promotionTarget),
}));

export const promotionTargetRelations = relations(
  promotionTarget,
  ({ one }) => ({
    promotion: one(promotion, {
      fields: [promotionTarget.promotionId],
      references: [promotion.id],
    }),
    team: one(team, {
      fields: [promotionTarget.teamId],
      references: [team.id],
    }),
  }),
);

export const catalogRelations = relations(catalog, ({ one, many }) => ({
  organization: one(organization, {
    fields: [catalog.organizationId],
    references: [organization.id],
  }),
  views: many(catalogView),
}));

export const catalogViewRelations = relations(catalogView, ({ one }) => ({
  catalog: one(catalog, {
    fields: [catalogView.catalogId],
    references: [catalog.id],
  }),
}));

export const messageRelation = relations(messages, ({ many }) => ({
  recipients: many(messageRecipients),
}));

export const messageRecipientRelation = relations(
  messageRecipients,
  ({ one }) => ({
    message: one(messages, {
      fields: [messageRecipients.messageId],
      references: [messages.id],
    }),
  }),
);
