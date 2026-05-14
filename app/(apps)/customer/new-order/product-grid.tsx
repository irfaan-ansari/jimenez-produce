import React from "react";
import { ProductItem } from "./product-item";
import { withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { KanbanItem } from "@/components/ui/kanban";
import { LAYOUT_MAP } from "@/hooks/use-layout-prefrence";
import { formOpt, OrderItem } from "./order-form-options";
import { useOrderUIStore } from "@/lib/store/order-store";

type ProductGridProps = {
  items: OrderItem[];
  selectable?: boolean;
  draggable?: boolean;
};

export const ProductGrid = withForm({
  ...formOpt,
  props: {} as ProductGridProps,
  render: function Render({ form, items, selectable, draggable }) {
    const layout = useOrderUIStore((s) => s.layout);
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
      <div
        className="group/card @container min-w-0 flex-1 space-y-5"
        data-layout={layout}
      >
        <div className={`grid ${currentLayout.className}`}>
          {items.map((product) => {
            const qty = lineItemMap.get(product.productId)?.qty ?? 0;

            const content = (
              <ProductItem
                product={product}
                quantity={qty}
                onUpdateQty={(newQty) => updateQty(product, newQty)}
                selectable={selectable}
                draggable={draggable}
              />
            );

            if (!draggable) {
              return (
                <React.Fragment key={product.productId}>
                  {content}
                </React.Fragment>
              );
            }

            return (
              <KanbanItem
                key={product.productId}
                value={String(product.productId)}
              >
                {content}
              </KanbanItem>
            );
          })}
        </div>
      </div>
    );
  },
});
