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
  taxRuleItems: many(taxRuleItem),
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

export const lineItemRelations = relations(lineItem, ({ one }) => ({
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
}));

export const orderGuideItemRelations = relations(orderGuideItem, ({ one }) => ({
  team: one(team, {
    fields: [orderGuideItem.teamId],
    references: [team.id],
  }),
  product: one(product, {
    fields: [orderGuideItem.productId],
    references: [product.id],
  }),
}));

export const taxRuleRelations = relations(taxRule, ({ one, many }) => ({
  organization: one(organization, {
    fields: [taxRule.organizationId],
    references: [organization.id],
  }),
  taxRuleItem: many(taxRuleItem),
}));

export const taxRuleItemRelations = relations(taxRuleItem, ({ one }) => ({
  taxRule: one(taxRule, {
    fields: [taxRuleItem.taxRuleId],
    references: [taxRule.id],
  }),
  team: one(team, {
    fields: [taxRuleItem.teamId],
    references: [team.id],
  }),
}));
