import { OrderItem } from "./order-form-options";
import { Badge } from "@/components/ui/badge";
import { cn, formatUSD } from "@/lib/utils";
import { format } from "date-fns/format";

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
        "h-4 shrink-0 rounded-sm bg-primary whitespace-nowrap uppercase",
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
