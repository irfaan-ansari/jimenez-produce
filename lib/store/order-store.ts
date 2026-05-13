import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LayoutGrid, LayoutList } from "lucide-react";

export const LAYOUT_MAP = {
  list: {
    value: "list",
    icon: LayoutList,
    className: "grid-cols-1 gap-1",
  },

  grid: {
    value: "grid",
    icon: LayoutGrid,
    className:
      "grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @8xl:grid-cols-8 gap-4",
  },
} as const;

export type LayoutType = keyof typeof LAYOUT_MAP;

export type OrderTab = "all" | "guides";

type SelectedProduct = {
  productId: number;
  title: string;
  image?: string | null;
  categories?: string[];
  price: number;
};

type OrderUIStore = {
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;

  showCart: boolean;
  setShowCart: (value: boolean) => void;

  selectedTab: OrderTab;
  setSelectedTab: (value: OrderTab) => void;

  isSelecting: boolean;
  setIsSelecting: (value: boolean) => void;
  selectedItems: Map<number, SelectedProduct>;
  unselectAll: () => void;
  toggleSelected: (product: SelectedProduct) => void;
  isSelected: (id: number) => boolean;
};

export const useOrderUIStore = create<OrderUIStore>()(
  persist(
    (set, get) => ({
      layout: "grid",
      setLayout: (layout) => {
        set({ layout });
      },

      // cart
      showCart: false,
      setShowCart: (value) => {
        set({ showCart: value });
      },
      // tab
      selectedTab: "all",
      setSelectedTab: (value) => {
        set({ selectedTab: value });
      },
      // selection
      isSelecting: false,
      setIsSelecting: (value) => {
        set({ isSelecting: value });
      },
      selectedItems: new Map(),

      toggleSelected: (product) => {
        set((state) => {
          const next = new Map(state.selectedItems);

          if (next.has(product.productId)) {
            next.delete(product.productId);
          } else {
            next.set(product.productId, product);
          }

          return {
            selectedItems: next,
          };
        });
      },
      unselectAll: () => {
        set({
          selectedItems: new Map(),
          isSelecting: false,
        });
      },

      isSelected: (id) => get().selectedItems.has(id),
    }),
    {
      name: "order-ui-store",
      partialize: (state) => ({
        layout: state.layout,
        selectedTab: state.selectedTab,
      }),
    },
  ),
);
