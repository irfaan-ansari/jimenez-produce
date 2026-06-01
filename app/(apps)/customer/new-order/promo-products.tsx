"use client";
import { withForm } from "@/hooks/form-context";
import { formOpt, OrderItem } from "./order-form-options";

import { useStore } from "@tanstack/react-form";
import React from "react";
import { ImageOff, X } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import { ProductItemQty } from "./product-item-qty";

import { useLocalStorage } from "@/hooks/use-local-storage";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePromotionsCustomer } from "@/hooks/data/promotions";

const STORAGE_KEY = "hide-promo-products";

export const PromoProducts = withForm({
  ...formOpt,
  render: function Render({ form }) {
    const { value, set } = useLocalStorage(STORAGE_KEY, false);

    if (value) {
      return null;
    }

    const { data, isPending, isError } = usePromotionsCustomer({
      placement: "new-order",
    });

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

    const plugin = React.useMemo(
      () => Autoplay({ delay: 5000, stopOnInteraction: true }),
      [],
    );

    return (
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin]}
        className="md:max-w-90 md:fixed md:bottom-6 md:right-6 md:z-3"
      >
        <CarouselContent>
          {data?.data.map((p) => {
            return p.products.map((product) => {
              const qty = lineItemMap.get(product.id)?.qty ?? 0;
              return (
                <CarouselItem
                  key={product.id}
                  className="basis-full sm:basis-1/2 md:basis-full"
                >
                  <div className="flex gap-3  items-start relative p-3 bg-linear-to-br border-2 shadow-xs from-white via-lime-50 to-sky-50 rounded-xl">
                    <div className="relative inline-flex aspect-square w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          width={200}
                          height={200}
                          className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
                        />
                      ) : (
                        <ImageOff className="size-4 opacity-40 group-data-[layout=grid]/card:size-6" />
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <h4 className="text-sm leading-tight font-medium">
                        {product.title}
                      </h4>
                      <div className="min-w-0 overflow-auto text-muted-foreground uppercase text-xs font-medium">
                        {product.categories?.join(" • ")}
                      </div>
                      <div className="flex justify-between">
                        <div className="w-24 self-center font-bold text-primary">
                          {formatUSD(product.finalPrice ?? 0)}
                        </div>
                        <ProductItemQty
                          showButton={true}
                          value={Number(qty)}
                          onChange={(newQty) => {
                            const { id, finalPrice, ...rest } = product;
                            updateQty(
                              // @ts-ignore
                              {
                                ...rest,
                                productId: id,
                                price: finalPrice,
                                total: finalPrice,
                              },
                              newQty,
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            });
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-2" />
        <CarouselNext className="-right-2" />
      </Carousel>
    );
  },
});
