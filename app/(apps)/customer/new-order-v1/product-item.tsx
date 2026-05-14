"use client";
import { cn } from "@/lib/utils";
import { Thumbnail } from "./thumbnail";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { OrderItem } from "./order-form-options";
import { GripVertical, Star } from "lucide-react";
import { LastPurchase, Price } from "./card-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductItemQty } from "./product-item-qty";
import { SortableItem, SortableItemHandle } from "@/components/reui/sortable";
import { AddToOrderGuideDialog } from "@/components/admin/add-to-order-guide-dialog";
import { useOrderUIStore } from "@/lib/store/order-store";

interface ProductItemProps {
  product: OrderItem;
  quantity: number;
  onUpdateQty: (qty: number) => void;

  // for creating new guide
  selectable?: boolean;
  selected?: boolean;
  toggleSelected?: (v: boolean) => void;

  // for dragging
  sortable?: boolean;
}
export const ProductItem = ({
  product,
  quantity,
  onUpdateQty,

  sortable,
  selectable,
}: ProductItemProps) => {
  const selected = useOrderUIStore(
    (s) => !!s.selectedItems.get(product.productId),
  );
  const toggleSelected = useOrderUIStore((s) => s.toggleSelected);

  return (
    <SortableItem
      value={String(product.productId)}
      className={cn(
        `relative flex animate-in cursor-pointer items-center gap-4 overflow-hidden rounded-xl border bg-background p-3 transition fade-in-50 select-none slide-in-from-bottom-10 group-data-[layout=grid]/card:h-full group-data-[layout=grid]/card:flex-col
        group-data-[layout=grid]/card:items-stretch group-data-[layout=grid]/card:gap-0 group-data-[layout=grid]/card:p-0 
        hover:-translate-y-0.5 hover:shadow-md`,
        "transition duration-200 ring-2 ring-offset-background ring-transparent",
        "has-data-checked:ring-sidebar-accent has-data-checked:ring-offset-1",
        "data-[dragging=true]:ring-offset-1 data-[dragging=true]:ring-black/50 data-[dragging=true]:opacity-100",
        selected && selectable ? "ring-2 ring-black/50" : "",
      )}
      onClick={() => {
        onUpdateQty(quantity + 1);
      }}
    >
      {/* sortable item handle */}
      {sortable && (
        <SortableItemHandle
          onClick={(e) => e.stopPropagation()}
          className="group-data-[layout=grid]/card:absolute group-data-[layout=grid]/card:shadow-sm z-1 bg-background rounded-md size-7 inline-flex items-center justify-center left-2 top-2"
        >
          <GripVertical className="size-4" />
        </SortableItemHandle>
      )}

      {/* selectable item for creating new guide */}
      {selectable && (
        <Label
          htmlFor={String(product.productId)}
          className="group-data-[layout=grid]/card:absolute group-data-[layout=grid]/card:p-2 inset-0 bg-transparent z-2 flex flex-col items-start justify-start"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="absolute left-0 top-0 z-0 size-20  backdrop-blur-3xl mask-[linear-gradient(145deg,#000_20%,transparent_60%)] [-webkit-mask-image:linear-gradient(140deg,#000_20%,transparent_60%)]" />
          <Checkbox
            id={String(product.productId)}
            className="bg-background p-3 rounded-md data-checked:bg-sidebar-accent"
            checked={selected}
            onCheckedChange={() =>
              toggleSelected({
                productId: product.productId,
                title: product.title,
                image: product.image,
                categories: product.categories,
                price: Number(product.price),
              })
            }
          />
        </Label>
      )}

      {/* guide item action for card layout */}
      <div
        className="absolute top-1.5 right-1.5 z-1 group-data-[layout=list]/card:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {product.isGuide ? (
          <Star className="size-4 fill-amber-400" />
        ) : (
          <AddToOrderGuideDialog
            item={{
              id: String(product.productId),
              title: product.title,
              image: product.image || "",
              finalPrice: product.price,
            }}
          >
            <Button
              size="icon-xs"
              type="button"
              variant="outline"
              onClick={(e) => e.stopPropagation()}
              className="size-7 rounded-lg"
            >
              <Star className="size-3.5 fill-foreground" />
            </Button>
          </AddToOrderGuideDialog>
        )}
      </div>
      <Thumbnail
        product={product}
        qty={quantity}
        onChange={(newValue) => onUpdateQty(newValue)}
      />

      <div
        className="flex min-w-0 flex-1 items-start gap-4
             group-data-[layout=grid]/card:w-full
             group-data-[layout=grid]/card:flex-col
             group-data-[layout=grid]/card:justify-between
             group-data-[layout=grid]/card:p-3"
      >
        <div className="flex w-full min-w-0 flex-col gap-1">
          <h4 className="text-sm leading-tight font-medium group-data-[layout=grid]/card:order-2">
            {product.title}
          </h4>

          <div className="flex w-full items-center gap-2">
            <div className="no-scrollbar flex min-w-0 flex-nowrap items-center gap-1 overflow-auto">
              {product.categories?.map((cat, i) => (
                <span
                  key={cat + i}
                  className="inline-block text-xs leading-[1.1] font-medium whitespace-nowrap text-muted-foreground uppercase not-last:border-r-2 not-last:pr-1"
                >
                  {cat}
                </span>
              ))}
            </div>

            <LastPurchase
              product={product}
              className="group-data-[layout=grid]/card:hidden"
            />
          </div>
        </div>

        {/* order guide action for list layout */}
        <div
          className="self-center group-data-[layout=grid]/card:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {product.isGuide ? (
            <Star className="size-4 fill-amber-400" />
          ) : (
            <AddToOrderGuideDialog
              item={{
                id: String(product.productId),
                title: product.title,
                image: product.image || "",
                finalPrice: product.price,
              }}
            >
              <Button
                size="icon-xs"
                type="button"
                variant="outline"
                onClick={(e) => e.stopPropagation()}
                className="size-8 rounded-md"
              >
                <Star className="size-3.5 fill-foreground" />
              </Button>
            </AddToOrderGuideDialog>
          )}
        </div>

        <div className="ml-auto w-24 self-center text-xs text-muted-foreground group-data-[layout=grid]/card:hidden">
          {product.pack ?? null}
        </div>

        <Price
          price={product.price}
          className="group-data-[layout=grid]/card:hidden"
        />

        <ProductItemQty
          value={quantity}
          onChange={onUpdateQty}
          className="group-data-[layout=grid]/card:hidden"
        />

        <div className="flex w-full items-center gap-2 group-data-[layout=list]/card:hidden">
          <div className="flex flex-1 flex-col">
            <div className="text-xs text-muted-foreground">
              {product.pack ?? null}
            </div>

            <Price price={product.price} className="w-auto self-start" />
          </div>
          <ProductItemQty value={quantity} onChange={onUpdateQty} />
        </div>
      </div>
    </SortableItem>
  );
};
