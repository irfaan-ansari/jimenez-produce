import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LayoutGrid, LayoutList } from "lucide-react";
import { OrderItem } from "@/app/(apps)/customer/new-order/order-form-options";

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
      "grid-cols-2 gap-2 @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @8xl:grid-cols-8 @lg:gap-4",
  },
} as const;

export type OrderTab = "all" | "guides";
export type LayoutType = keyof typeof LAYOUT_MAP;
export type SelectionMode = "create" | "update" | "idle";

type SelectedProduct = {
  productId: number;
  title: string;
  image?: string | null;
  categories?: string[];
  price: string;
};

type SelectionState = {
  mode: SelectionMode;
  guideId: number | null;
  name?: string;
  description?: string;
  items: Record<number, SelectedProduct>;
};

type OrderUIStore = {
  // layout
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;

  // cart
  showCart: boolean;
  setShowCart: (value: boolean) => void;
  // tab
  selectedTab: OrderTab;
  setSelectedTab: (value: OrderTab) => void;

  // selection
  selectionState: SelectionState;
  setSelectionState: (selectionState: Partial<SelectionState>) => void;
  clearSelectionState: () => void;
  toggleSelected: (product: SelectedProduct) => void;

  // filters
  filter: Record<string, string | undefined>;
  setFilter: ({ key, value }: Record<string, string | undefined>) => void;

  // promo
  showPromo: boolean;
  setShowPromo: (value: boolean) => void;

  // cart state
  promoCart: Record<string, OrderItem[] | []>;
  setPromoCart: (args: { key: string; items: OrderItem[] }) => void;
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
      selectionState: {
        mode: "idle",
        guideId: null,
        items: {},
      },
      setSelectionState: (newState) => {
        const {
          mode = "idle",
          guideId = null,
          name = "",
          description = "",
          items = {},
        } = newState;
        set({ selectionState: { mode, guideId, name, description, items } });
      },
      clearSelectionState: () => {
        set({
          selectionState: {
            mode: "idle",
            guideId: null,
            items: {},
          },
        });
      },

      toggleSelected: (product: SelectedProduct) => {
        set((state) => {
          const exists = !!state.selectionState.items[product.productId];

          const nextItems = {
            ...state.selectionState.items,
          };

          if (exists) {
            delete nextItems[product.productId];
          } else {
            nextItems[product.productId] = product;
          }

          return {
            selectionState: {
              ...state.selectionState,
              items: nextItems,
            },
          };
        });
      },

      // filters
      filter: {},
      setFilter: (filter) => {
        set({
          filter,
        });
      },
      showPromo: false,
      setShowPromo: (value) => {
        set({ showPromo: value });
      },
      promoCart: {},
      setPromoCart: ({ key, items }) => {
        set((state) => ({
          promoCart: {
            ...state.promoCart,
            [key]: items,
          },
        }));
      },
    }),
    {
      name: "order-ui-store",
      partialize: (state) => ({
        layout: state.layout,
        selectedTab: state.selectedTab,
        filter: state.filter,
        cart: state.promoCart,
      }),
    },
  ),
);
