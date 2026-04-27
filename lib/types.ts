import { auth } from "./auth";
import { inviteStatusMap } from "./constants/customer";
import { jobApplicationStatusMap } from "./constants/job";
import { STATUS_MAP } from "./constants/status-map";
import {
  LineItemSelectType,
  OrderSelectType,
  PriceLevelSelectType,
  ProductSelectType,
  TaxRuleSelectType,
  TeamSelectType,
} from "./db/schema";

export type JobApplicationStatus = keyof typeof jobApplicationStatusMap;

export interface EmailTemplateConfig {
  subject: string;
  to: string[] | [];
  template: React.ComponentType<any>;
}

export type CustomerInviteStatus = keyof typeof inviteStatusMap;
export type CustomerApplicationStatus =
  | keyof typeof STATUS_MAP
  | CustomerInviteStatus;

type ActionSuccess<T> = {
  success: true;
  data: T;
  error: null;
};

type ActionError = {
  success: false;
  data: null;
  error: {
    message: string;
  };
};

export type ActionResult<T> = ActionSuccess<T> | ActionError;
export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CustomerProductType = ProductSelectType & {
  lastPurchased: LineItemSelectType;
  guide: { id: number; quantity: string | null } | null;
};

export type AdminProductType = ProductSelectType;

export type AdminProductResponse = {
  data: AdminProductType[];
  pagination: Pagination;
};

export type CustomerProductResponse = {
  data: CustomerProductType[];
  pagination: Pagination;
};

export type ProductCategoriesResponse = {
  data: string[];
  pagination: Pagination;
};

export type OrderType = OrderSelectType & {
  lineItems: LineItemSelectType[];
  team: TeamSelectType;
};

export type OrderResponse = {
  data: OrderType[];
  pagination: Pagination;
};

export interface TopProduct {
  title: string;
  totalQuantity: number;
  totalRevenue: number;
  lastPurchasedAt: Date | string;
}

interface PriceLevelItem {
  id: number;
  basePrice: string;
  price: string;
  productId: number;
  title: string;
  identifier: string;
  image: string | undefined;
}

export type PriceLevelType = PriceLevelSelectType & {
  priceLevelItem: PriceLevelItem[];
};

export type PriceLevelResponse = {
  data: PriceLevelType[];
  pagination: Pagination;
};

export type PriceLevelDetailResponse = {
  data: PriceLevelSelectType & {
    priceLevelItem: PriceLevelItem[];
  };
};

export type TaxRuleResponse = {
  data: TaxRuleSelectType[];
  pagination: Pagination;
};

export type Role = "owner" | "sales" | "manager" | "member";

export type Session = typeof auth.$Infer.Session;
export type Warehouse = typeof auth.$Infer.Organization;

export type Team = typeof auth.$Infer.Team & {
  members: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    image?: string | undefined;
  }[];
};

type BaseMember = typeof auth.$Infer.Member;

export type Member = Omit<BaseMember, "user"> & {
  user: BaseMember["user"] & {
    phoneNumber: string;
  };
  lastLogin: string | null;
};
