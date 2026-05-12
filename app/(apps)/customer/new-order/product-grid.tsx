import React from "react";
import { ProductItem } from "./product-item";
import { withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { LAYOUT_MAP } from "@/hooks/use-layout-prefrence";
import { formOpt, OrderItem } from "./order-form-options";
import { Sortable } from "@/components/reui/sortable";

type ProductGridProps = {
  items: OrderItem[];
  layout: string;
  selectable?: boolean;
  sortable?: boolean;
  onMoveComplete?: (items: OrderItem[]) => void;
};

export const ProductGrid = withForm({
  ...formOpt,
  props: {} as ProductGridProps,
  render: function Render({
    form,
    items,
    layout,
    sortable,
    selectable,
    onMoveComplete,
  }) {
    const currentLayout = LAYOUT_MAP[layout as keyof typeof LAYOUT_MAP];
    const lineItems = useStore(form.store, (state) => state.values.lineItems);

    const updateQty = React.useCallback(
      (product: OrderItem, qty: number) => {
        const index = lineItems.findIndex(
          (i) => i.productId === product.productId,
        );

        if (qty <= 0) {
          if (index >= 0) {
            form.removeFieldValue("lineItems", index);
          }

          return;
        }

        if (index >= 0) {
          form.setFieldValue(`lineItems[${index}].quantity`, String(qty));
        } else {
          form.pushFieldValue("lineItems", {
            ...product,
            quantity: String(qty),
          });
        }
      },
      [form, lineItems],
    );

    return (
      <Sortable
        data-layout={layout}
        value={items}
        onValueChange={(v) => {
          const reordered = v.map((i) => ({
            ...i,
            productId: Number(i.productId),
          }));
          onMoveComplete?.(reordered);
        }}
        getItemValue={(item) => String(item.productId)}
        strategy={layout === "grid" ? "grid" : "vertical"}
        className={`grid @container group/card ${currentLayout.className}`}
      >
        {items.map((product) => {
          const qty =
            Number(
              lineItems.find((i) => i.productId === product.productId)
                ?.quantity,
            ) || 0;

          return (
            <ProductItem
              key={product.productId}
              product={product}
              quantity={qty}
              onUpdateQty={(newQty) => updateQty(product, newQty)}
              selectable={selectable}
              sortable={sortable}
              selected={false}
              toggleSelected={() => {}}
            />
          );
        })}
      </Sortable>
    );
  },
});
