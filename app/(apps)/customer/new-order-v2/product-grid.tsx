import React from "react";
import { ProductItem } from "./product-item";
import { withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { LAYOUT_MAP } from "@/hooks/use-layout-prefrence";
import { formOpt, OrderItem } from "./order-form-options";

type ProductGridProps = {
  items: OrderItem[];
  layout: string;
  sortable?: boolean;
  selectable?: boolean;
  onMoveComplete?: (items: OrderItem[]) => void;
};

export const ProductGrid = withForm({
  ...formOpt,
  props: {} as ProductGridProps,
  render: function Render({
    form,
    items,
    layout,
    selectable,
    sortable,
    onMoveComplete,
  }) {
    const currentLayout = LAYOUT_MAP[layout as keyof typeof LAYOUT_MAP];

    const lineItems = useStore(form.store, (s) => s.values.lineItems);

    const lineItemMap = React.useMemo(() => {
      return new Map<
        number,
        {
          qty: number;
          index: number;
        }
      >(
        lineItems.map((item, index) => [
          item.productId,
          {
            qty: Number(item.quantity),
            index,
          },
        ]),
      );
    }, [lineItems]);

    const updateQty = React.useCallback(
      (product: OrderItem, qty: number) => {
        const index = lineItemMap.get(product.productId)?.index ?? -1;

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
      <div className={`grid ${currentLayout.className}`}>
        {items.map((product) => {
          const qty = lineItemMap.get(product.productId)?.qty ?? 0;
          return (
            <ProductItem
              key={product.productId}
              product={product}
              quantity={qty}
              onUpdateQty={(newQty) => updateQty(product, newQty)}
              sortable={sortable}
              selectable={selectable}
            />
          );
        })}
      </div>
    );
  },
});
