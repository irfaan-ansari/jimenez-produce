"use client";

import { formatUSD } from "@/lib/utils";
import { ImageOff, X } from "lucide-react";
import { useStore } from "@tanstack/react-form";
import { withForm } from "@/hooks/form-context";
import { Button } from "@/components/ui/button";
import { ProductItemQty } from "./product-item-qty";
import { AnimatePresence, motion } from "motion/react";
import { formOpt, OrderItem } from "./order-form-options";
import { usePromotionsCustomer } from "@/hooks/data/promotions";
import React, { useMemo, useEffect, useState, useRef } from "react";
import { useOrderUIStore } from "@/lib/store/order-store";

export const PromoProducts = withForm({
  ...formOpt,
  render: function Render({ form }) {
    const showPromo = useOrderUIStore((s) => s.showPromo);
    const setShowPromo = useOrderUIStore((s) => s.setShowPromo);

    const { data } = usePromotionsCustomer({ placement: "new-order" });
    const lineItems = useStore(form.store, (s) => s.values.lineItems);

    const lineItemMap = useMemo(() => {
      const map = new Map<number, { qty: number; index: number }>();
      for (let i = 0; i < lineItems.length; i++) {
        const item = lineItems[i];
        map.set(item.productId, {
          qty: Number(item.quantity),
          index: i,
        });
      }
      return map;
    }, [lineItems]);

    const promoProducts = useMemo(() => {
      if (!data?.data) return [];
      return data.data
        .flatMap((x) => x.products)
        .map((p) => ({
          productId: p.id,
          title: p.title,
          image: p.image,
          identifier: p.identifier,
          categories: p.categories ?? [],
          price: p.finalPrice,
          total: p.finalPrice,
          quantity: "0",
          isTaxable: p.isTaxable ?? false,
          lastPurchased: null,
        }));
    }, [data, lineItemMap]);

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
      [form, lineItemMap],
    );

    return (
      <AnimatePresence mode="wait">
        {showPromo && promoProducts.length > 0 && (
          <PromoCard
            products={promoProducts}
            lineItemMap={lineItemMap}
            onClose={() => setShowPromo(false)}
            onQtyChange={updateQty}
          />
        )}
      </AnimatePresence>
    );
  },
});

interface PromoCardProps {
  products: OrderItem[];
  lineItemMap: Map<number, { qty: number; index: number }>;
  onClose: () => void;
  onQtyChange: (product: OrderItem, qty: number) => void;
}

export const PromoCard: React.FC<PromoCardProps> = ({
  products,
  lineItemMap,
  onClose,
  onQtyChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= products.length) {
      onClose();
    }
  }, [activeIndex, products.length, onClose]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        return current + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length]);

  const product = products[activeIndex];

  if (!product) return null;

  const currentQty = lineItemMap.get(product.productId)?.qty ?? 0;

  return (
    <motion.div
      key={product.productId}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 18,
        opacity: { duration: 1 },
      }}
      className="fixed z-50 bottom-6 right-6 w-90"
    >
      <div className="relative p-3 overflow-hidden border-2 shadow-lg rounded-xl bg-linear-to-br from-white via-lime-50 to-sky-50">
        <Button
          size="icon-xs"
          variant="outline"
          className="absolute transition-colors rounded-full right-2 top-2 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>

        <div className="flex items-start gap-3">
          <div className="relative inline-flex items-center justify-center w-16 overflow-hidden rounded-lg aspect-square shrink-0 bg-secondary">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="absolute inset-0 object-contain w-full h-full mix-blend-multiply"
                loading="lazy"
              />
            ) : (
              <ImageOff className="size-4 opacity-40" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <h4 className="text-sm font-medium leading-tight line-clamp-2">
              {product.title}
            </h4>

            {product.categories && (
              <div className="min-w-0 overflow-hidden text-xs font-medium uppercase text-ellipsis whitespace-nowrap text-muted-foreground">
                {product.categories.join(" • ")}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="font-bold text-primary">
                {formatUSD(product.price ?? 0)}
              </div>
              <ProductItemQty
                showButton
                value={currentQty}
                onChange={(newQty) => onQtyChange(product, newQty)}
              />
            </div>
          </div>
        </div>

        <motion.div
          key={`progress-${product.productId}`}
          className="absolute inset-x-0 rounded-xl top-0 h-0.5 origin-left bg-sidebar-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};
