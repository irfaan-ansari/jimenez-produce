import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns/format";
import { cn, formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ImageOff, Info } from "lucide-react";
import { Tooltip } from "@/components/tooltip";
import { OrderItem } from "./order-form-options";
import { ProductItemQty } from "./product-item-qty";
import { getNextDeliveryLabel } from "@/lib/delivery-rule";

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
        <div className="relative self-start inline-flex aspect-square w-12 shrink-0 items-center justify-center overflow-hidden rounded-t-lg bg-secondary group-data-[layout=grid]/card:aspect-video group-data-[layout=grid]/card:w-full group-data-[layout=list]/card:rounded-lg">
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
          <div className="aspect-video relative rounded-t-xl bg-secondary">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                width={500}
                height={500}
                className="aspect-video object-contain mix-blend-multiply"
              />
            )}
            <LastPurchase
              product={product}
              className="absolute left-2 bottom-2"
            />
          </div>

          <div className="space-y-2 p-4">
            <div className="min-w-0 overflow-auto text-muted-foreground uppercase text-xs font-medium">
              {product.categories?.join(" • ")}
            </div>
            <h4 className="text-base leading-tight font-medium">
              {product.title}
            </h4>
            <div className="flex w-full items-center justify-between gap-2 group-data-[layout=list]/card:hidden">
              <Price
                price={product.price}
                pack={product.pack}
                unit={product.unit}
                unitSize={product.unitSize}
                className="w-auto self-start"
              />
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
  const delivery = getNextDeliveryLabel(product.identifier);

  if (delivery) {
    return (
      <Tooltip
        content={
          <div>
            Delivery {delivery.dayName} •{" "}
            {format(new Date(delivery.date!), "MM/dd")}
          </div>
        }
      >
        <Badge
          className={cn(
            "h-4 shrink-0 rounded-sm whitespace-nowrap uppercase",
            className,
          )}
        >
          Special Item <Info />
        </Badge>
      </Tooltip>
    );
  }

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
  pack,
  unit,
  unitSize,
  className,
}: {
  price: number | string;
  className?: string;
  pack?: string | null;
  unit?: string | null;
  unitSize?: string | null;
}) => {

  return (
    <div className={cn("font-bold text-primary", className)}>
      {pack && unitSize && (
        <div className="text-xs text-muted-foreground text-normal font-medium">
          {pack}/{unitSize} {unit}
        </div>
      )}
      {formatUSD(price)}
      {unit && (
        <span className="text-[10px] text-muted-foreground">/{unit}</span>
      )}
    </div>
  );
};
