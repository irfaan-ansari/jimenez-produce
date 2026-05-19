import { create } from "zustand";
import { OrderItem } from "@/app/(apps)/customer/new-order/order-form-options";

export type Columns = Record<string, OrderItem[]>;

type ColumnMeta = {
  id: number;
  name: string;
  description: string | null;
  position: number;
};

type OrderGuideStore = {
  columns: Columns;
  columnMeta: Record<string, ColumnMeta>;
  setColumns: ({
    columns,
    columnMeta,
  }: {
    columns: Columns;
    columnMeta?: Record<string, ColumnMeta>;
  }) => void;
};

export const useOrderGuideStore = create<OrderGuideStore>((set) => ({
  columns: {},
  columnMeta: {},
  setColumns: ({ columns, columnMeta }) => {
    set((state) => ({
      columns,
      columnMeta: { ...state.columnMeta, ...(columnMeta ?? {}) },
    }));
  },
}));
