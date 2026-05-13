"use client";

import { cn } from "@/lib/utils";
import { LastPurchase, Price, Thumbnail } from "./thumbnail";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { OrderItem } from "./order-form-options";
import { GripVertical, Star } from "lucide-react";
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
    <div
      className={cn(
        `relative flex animate-in items-start @2xl:items-center cursor-pointer gap-4 overflow-hidden rounded-xl border bg-background p-3 transition fade-in-50 select-none slide-in-from-bottom-10 group-data-[layout=grid]/card:h-full group-data-[layout=grid]/card:flex-col
        group-data-[layout=grid]/card:items-stretch group-data-[layout=grid]/card:gap-0 group-data-[layout=grid]/card:p-0 
        hover:-translate-y-0.5 hover:shadow-md`,
        "ring-2 ring-transparent ring-offset-background transition duration-200",
        "has-data-checked:ring-sidebar-accent has-data-checked:ring-offset-1",
        "data-[dragging=true]:opacity-100 data-[dragging=true]:ring-black/50 data-[dragging=true]:ring-offset-1",
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
          className="top-2 left-2 z-1 inline-flex h-8 self-center items-center justify-center rounded-md bg-background group-data-[layout=grid]/card:absolute group-data-[layout=grid]/card:shadow-sm group-data-[layout=grid]/card:size-7"
        >
          <GripVertical className="size-4" />
        </SortableItemHandle>
      )}

      {/* selectable item for creating new guide */}
      {selectable && (
        <Label
          htmlFor={String(product.productId)}
          className="inset-0 z-2 flex flex-col items-start justify-start bg-transparent group-data-[layout=grid]/card:absolute group-data-[layout=grid]/card:p-2"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="absolute top-0 left-0 z-0 size-20  mask-[linear-gradient(145deg,#000_20%,transparent_60%)] backdrop-blur-3xl [-webkit-mask-image:linear-gradient(140deg,#000_20%,transparent_60%)]" />
          <Checkbox
            id={String(product.productId)}
            className="bg-background p-2 data-checked:bg-sidebar-accent"
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

      <Thumbnail
        product={product}
        qty={quantity}
        onChange={(newValue) => onUpdateQty(newValue)}
      />

      <div className="flex min-w-0 flex-col @2xl:flex-row flex-1 items-start gap-4 group-data-[layout=grid]/card:w-full group-data-[layout=grid]/card:flex-col group-data-[layout=grid]/card:justify-between group-data-[layout=grid]/card:p-3">
        <div className="flex w-full min-w-0 flex-col gap-1">
          <h4 className="text-sm leading-tight font-medium group-data-[layout=grid]/card:order-2">
            {product.title}
          </h4>

          <div className="flex flex-col @2xl:flex-row w-full items-start @2xl:items-center gap-2">
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

        <div className="flex gap-4 justify-between w-full @2xl:w-auto">
          {/* guide item action for both layouts */}
          <div
            className="absolute top-2 right-2 z-2 @2xl:group-data-[layout=list]/card:relative @2xl:group-data-[layout=list]/card:top-0"
            onClick={(e) => e.stopPropagation()}
          >
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
                className="size-7 rounded-lg border-none bg-background/50 backdrop-blur-lg group-data-[layout=list]/card:shadow-sm"
              >
                <Star className="size-3.5 fill-foreground" />
              </Button>
            </AddToOrderGuideDialog>
          </div>

          <Price
            price={product.price}
            className="group-data-[layout=grid]/card:hidden @2xl:text-right"
          />

          <ProductItemQty
            value={quantity}
            onChange={onUpdateQty}
            className="group-data-[layout=grid]/card:hidden"
          />
        </div>

        {/* card layout */}
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
    </div>
  );
};
