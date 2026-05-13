import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrderItem } from "./order-form-options";
import { ProductItemQty } from "./product-item-qty";
import { cn, formatUSD } from "@/lib/utils";
import { format } from "date-fns/format";

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
            className="absolute bottom-1 left-2 rounded-sm hidden group-data-[layout=grid]/card:inline-flex"
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

export const LastPurchase = ({
  product,
  className,
}: {
  product: OrderItem;
  className?: string;
}) => {
  if (!product.lastPurchased?.id) return;
  return (
    <Badge
      className={cn(
        "h-4 shrink-0 rounded-sm whitespace-nowrap uppercase",
        className,
      )}
    >
      {product.lastPurchased.quantity}cs •{" "}
      {format(new Date(product.lastPurchased.createdAt!), "MM/dd")}
    </Badge>
  );
};

/* Product Price */
export const Price = ({
  price,
  className,
}: {
  price: number | string;
  className?: string;
}) => {
  return (
    <div className={cn("w-24 self-center font-bold text-primary", className)}>
      {formatUSD(price ?? 0)}
    </div>
  );
};
