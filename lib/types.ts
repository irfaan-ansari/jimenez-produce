import { inviteStatusMap, statusMap } from "./constants/customer";
import { jobApplicationStatusMap } from "./constants/job";
import {
  CustomerSelectType,
  InventorySelectType,
  LineItemSelectType,
  LocationSelectType,
  OrderSelectType,
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
  | keyof typeof statusMap
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
  inventory: InventorySelectType;
  lastPurchased: LineItemSelectType;
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
