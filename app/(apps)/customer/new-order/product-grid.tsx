import React from "react";
import { ProductItem } from "./product-item";
import { withForm } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { KanbanItem } from "@/components/ui/kanban";
import { formOpt, OrderItem } from "./order-form-options";
import { LAYOUT_MAP, useOrderUIStore } from "@/lib/store/order-store";
import { usePromotionsCustomer } from "@/hooks/data/promotions";

type ProductGridProps = {
  items: OrderItem[];
  selectable?: boolean;
  draggable?: boolean;
};

export const ProductGrid = withForm({
  ...formOpt,
  props: {} as ProductGridProps,
  render: function Render({ form, items, selectable, draggable }) {
    const { data } = usePromotionsCustomer({
      placement: "new-order",
    });

    const layout = useOrderUIStore((s) => s.layout);
    const setShowPromo = useOrderUIStore((s) => s.setShowPromo);
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

    const promoTriggers = data?.data?.flatMap((x) => x.triggerProductIds) ?? [];

    const updateQty = React.useCallback(
      (product: OrderItem, qty: number) => {
        const index = lineItemMap.get(product.productId)?.index ?? -1;
        console.log(qty)
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
            quantity: String(qty)
          });
          if (promoTriggers.includes(product.productId)) {
            setShowPromo(true);
          }
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
          {items.map((item) => {
            const qty = lineItemMap.get(item.productId)?.qty ?? 0;

            const content = (
              <ProductItem
                product={item}
                quantity={qty}
                onUpdateQty={(newQty) => updateQty(item, newQty)}
                selectable={selectable}
                draggable={draggable}
              />
            );

            if (!draggable) {
              return (
                <React.Fragment key={item.productId}>{content}</React.Fragment>
              );
            }

            return (
              <KanbanItem key={item.productId} value={String(item.productId)}>
                {content}
              </KanbanItem>
            );
          })}
        </div>
      </div>
    );
  },
});
