import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { ImageOff } from "lucide-react";
import { OrderItem } from "./order-form-options";

import { ProductItemQty } from "./product-item-qty";
import { LastPurchase, Price } from "./card-badge";

export const Thumbnail = ({
  qty,
  product,
  onChange,
}: {
  product: OrderItem;
  qty: number;
  onChange: (qty: number) => void;
}) => {
  return (
    <HoverCard openDelay={500} closeDelay={10}>
      <HoverCardTrigger asChild>
        <div className="relative inline-flex aspect-square w-12 shrink-0 items-center justify-center overflow-hidden rounded-t-lg bg-secondary group-data-[layout=grid]/card:aspect-video group-data-[layout=grid]/card:w-full group-data-[layout=list]/card:rounded-lg">
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

          <LastPurchase
            product={product}
            className="absolute top-1 left-1 hidden group-data-[layout=grid]/card:inline-flex"
          />
        </div>
      </HoverCardTrigger>
      {product.image && (
        <HoverCardContent
          className="flex w-80 flex-col overflow-hidden rounded-xl p-0 text-base"
          align="center"
        >
          <div className="aspect-video rounded-t-xl bg-secondary">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                width={500}
                height={500}
                className="aspect-video object-contain mix-blend-multiply"
              />
            )}
          </div>

          <div className="space-y-3 p-4">
            <h4 className="text-base leading-tight font-medium">
              {product.title}
            </h4>

            <div className="flex w-full items-center gap-2">
              <div className="no-scrollbar flex min-w-0 flex-nowrap items-center gap-1 overflow-auto">
                {product.categories?.map((cat, i) => (
                  <Badge
                    key={cat + i}
                    variant="secondary"
                    className="h-5 shrink-0 rounded-xl px-1.5"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            <LastPurchase
              product={product}
              className="group-data-[layout=grid]/card:hidden"
            />

            <div className="flex w-full items-center gap-2 group-data-[layout=list]/card:hidden">
              <div className="flex flex-1 flex-col">
                <div className="text-xs text-muted-foreground">
                  {product.pack ?? null}
                </div>

                <Price price={product.price} className="w-auto self-start" />
              </div>
              <ProductItemQty value={qty} onChange={onChange} />
            </div>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};
