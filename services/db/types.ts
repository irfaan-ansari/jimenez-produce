import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  customer,
  customerInvite,
  jobApplications,
  jobInvite,
  lineItem,
  order,
  orderGuide,
  orderGuideItem,
  orderGuideTarget,
  priceLevel,
  priceLevelItem,
  product,
  taxRule,
  taxRuleItem,
} from "./schemas/schema";
import { organization, session, team, user } from "./schemas/auth";

// auth
export type OrganizationSelectType = InferSelectModel<typeof organization>;
export type OrganizationInsertType = InferInsertModel<typeof organization>;

export type TeamSelectType = InferSelectModel<typeof team>;
export type TeamInsertType = InferInsertModel<typeof team>;

export type UserInsertType = InferInsertModel<typeof user>;
export type UserSelectType = InferSelectModel<typeof user>;
export type SessionInsertType = InferInsertModel<typeof session>;
export type SessionSelectType = InferSelectModel<typeof session>;

// resources

export type ProductInsertType = InferInsertModel<typeof product>;
export type ProductSelectType = InferSelectModel<typeof product>;
export type CustomerSelectType = InferSelectModel<typeof customer>;
export type CustomerInsertType = InferInsertModel<typeof customer>;

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

export type TaxRuleSelectType = InferSelectModel<typeof taxRule>;
export type TaxRuleInsertType = InferInsertModel<typeof taxRule>;

export type TaxRuleItemSelectType = InferSelectModel<typeof taxRuleItem>;
export type TaxRuleItemInsertType = InferInsertModel<typeof taxRuleItem>;

export type OrderGuideSelectType = InferSelectModel<typeof orderGuide>;
export type OrderGuideInsertType = InferInsertModel<typeof orderGuide>;

export type OrderGuideItemSelectType = InferSelectModel<typeof orderGuideItem>;
export type OrderGuideItemInsertType = InferInsertModel<typeof orderGuideItem>;

export type OrderGuideTargetSelectType = InferSelectModel<
  typeof orderGuideTarget
>;
export type OrderGuideTargetInsertType = InferInsertModel<
  typeof orderGuideTarget
>;
