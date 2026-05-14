import { OrderItem } from "@/app/(apps)/customer/new-order/order-form-options";
import { create } from "zustand";

export type Columns = Record<string, OrderItem[]>;

type ColumnMeta = {
  id: number;
  name: string;
  description: string | null;
  position: number;
  itemCount: number;
};
type OrderGuideStore = {
  columns: Columns;
  setColumns: (columns: Columns) => void;

  columnMeta: Record<string, ColumnMeta>;
  setColumnMeta: (meta: Record<string, ColumnMeta>) => void;

  setColumnItems: (columnId: string, items: OrderItem[]) => void;

  addColumn: (columnId: string, items?: OrderItem[]) => void;
  removeColumn: (columnId: string) => void;
  addItem: (columnId: string, item: OrderItem) => void;
  removeItem: (columnId: string, itemId: number) => void;
};

export const useOrderGuideStore = create<OrderGuideStore>((set) => ({
  columns: {},
  setColumns: (columns) => {
    set({
      columns,
    });
  },

  columnMeta: {},
  setColumnMeta: (meta) =>
    set((state) => ({ columnMeta: { ...state.columnMeta, ...meta } })),

  setColumnItems: (columnId, items) =>
    set((state) => ({
      columns: {
        ...state.columns,
        [columnId]: items,
      },
    })),

  addColumn: (columnId, items = []) =>
    set((state) => ({
      columns: {
        ...state.columns,
        [columnId]: items,
      },
    })),

  removeColumn: (columnId) =>
    set((state) => {
      const next = { ...state.columns };

      delete next[columnId];

      return {
        columns: next,
      };
    }),
  addItem: (columnId, item) =>
    set((state) => ({
      columns: {
        ...state.columns,
        [columnId]: [...(state.columns[columnId] ?? []), item],
      },
    })),
  removeItem: (columnId, itemId) =>
    set((state) => ({
      columns: {
        ...state.columns,
        [columnId]: (state.columns[columnId] ?? []).filter(
          (item) => item.productId !== itemId,
        ),
      },
    })),
}));
