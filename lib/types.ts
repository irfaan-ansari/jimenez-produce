import { inviteStatusMap } from "./constants/customer";
import { jobApplicationStatusMap } from "./constants/job";
import { STATUS_MAP } from "./constants/status-map";
import {
  CustomerSelectType,
  InventorySelectType,
  LineItemSelectType,
  LocationSelectType,
  OrderSelectType,
  PriceLevelItemSelectType,
  PriceLevelSelectType,
  ProductSelectType,
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
  price: string | null;
  offerPrice: string | null;
  stock: string | null;
} & {
  lastPurchased: LineItemSelectType;
  guide: { id: number; quantity: string | null } | null;
};

export type AdminProductType = ProductSelectType & {
  inventory: InventorySelectType[];
};

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
  location: LocationSelectType;
  customer: CustomerSelectType;
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

export type PriceLevelType = PriceLevelSelectType & {
  priceLevelItem: PriceLevelItemSelectType;
};

export type PriceLevelResponse = {
  data: PriceLevelType[];
  pagination: Pagination;
};
