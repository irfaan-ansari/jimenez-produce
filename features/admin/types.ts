import { OrderGuideItem } from "@/hooks/use-orders";
import {
  LineItemSelectType,
  OrderGuideSelectType,
  OrderSelectType,
  ProductSelectType,
  TeamSelectType,
} from "@/services/db";

export interface TopProduct {
  title: string;
  totalQuantity: number;
  totalRevenue: number;
  lastPurchasedAt: Date | string;
}

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type OrderType = OrderSelectType & {
  lineItems: LineItemSelectType[];
  team: TeamSelectType;
};

export type OrderResponse = {
  data: OrderType[];
  pagination: Pagination;
};

export interface OrderGuide extends OrderGuideSelectType {
  items: OrderGuideItem[];
}

export interface OrderGuidesResponse {
  data: OrderGuide[];
  pagination: Pagination;
}

export type ProductType = Omit<ProductSelectType, "basePrice"> & {
  finalPrice: string;
  lastPurchased: {
    id: number | null;
    orderId: number | null;
    quantity: string | null;
    createdAt: Date | null;
  };
  isGuide: boolean;
  isSuggested: boolean;
};

export type ProductResponse = {
  data: ProductType[];
  pagination: Pagination;
};

export type ProductCategoriesResponse = {
  data: string[];
  pagination: Pagination;
};
