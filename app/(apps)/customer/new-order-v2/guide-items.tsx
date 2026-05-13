import React from "react";
import { X } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import { ProductGrid } from "./product-grid";
import { Badge } from "@/components/ui/badge";
import { formOpt, OrderItem } from "./order-form-options";
import { Button } from "@/components/ui/button";
import { withForm } from "@/hooks/form-context";
import { useInfiniteOrderGuides, useOrderGuide } from "@/hooks/use-orders";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { updateOrderGuide } from "@/server/order-guide";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const GuideList = () => {
  const { data, isEnabled, isPending } = useInfiniteOrderGuides("");

  const flat = data?.pages?.flatMap((page) => page.data);

  if (isPending) return null;

  return (
    <div className="overflow-hidden rounded-2xl border bg-background shadow-xs">
      <div className="flex items-center gap-3 p-6 shadow-xs">
        {isPending ? (
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-56" />
          </div>
        ) : (
          <div className="flex-1 space-y-1">
            <div className="flex items-start gap-2">
              <p className="text-base font-semibold">{data?.data?.name}</p>
              {!data?.data?.teamId && (
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-100"
                >
                  Suggested
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {data?.data?.items?.length} items
              </span>
              <span>•</span>
              <span className="font-medium">{formatUSD(0)} Estimated</span>
            </div>
          </div>
        )}

        <Button
          type="button"
          variant="destructive"
          onClick={() => queryParams({ del: "guideId" })}
        >
          <X /> Close
        </Button>
      </div>

      {/* item grid */}
    </div>
  );
};
export const GuideItems = withForm({
  ...formOpt,
  props: {} as Record<string, any>,
  render: function Render({ form, layout }) {
    const { searchParamsObj, queryParams } = useRouterStuff();
    const [items, setItems] = React.useState<OrderItem[]>([]);
    const queryClient = useQueryClient();
    const guideId = searchParamsObj.guideId;
    const { data, isEnabled, isPending } = useOrderGuide(guideId);

    const mapps = data?.pages?.flatMap((page) => page.data);

    const mappedProduct = React.useMemo(() => {
      return (
        data?.data?.items?.map((product) => {
          return {
            productId: product.productId,
            title: product.title,
            image: product.image,
            type: product.type,
            identifier: product.identifier,
            pack: product.pack,
            categories: product.categories ?? [],
            price: product.finalPrice,
            total: product.finalPrice,
            quantity: "0",
            isTaxable: product.isTaxable ?? false,
            lastPurchased: null,
            isGuide: !!data?.data?.teamId,
            isSuggested: !data?.data?.teamId,
          };
        }) ?? []
      );
    }, [data]);

    React.useEffect(() => {
      if (!guideId || mappedProduct.length === 0) return;

      setItems(mappedProduct);
    }, [guideId, mappedProduct]);

    // update order in db
    const handleMove = React.useCallback(
      async (nextItems: OrderItem[]) => {
        setItems(nextItems);
        if (!data || !data?.data) return;
        const { name = "", description = "" } = data?.data || {};

        const { success } = await updateOrderGuide(Number(guideId), {
          name,
          description,
          productIds: nextItems.map((item) => Number(item.productId)),
        });

        if (!success) {
          toast.error("Failed to update order guide");
        } else {
          queryClient.invalidateQueries({ queryKey: ["order-guide", guideId] });
        }
      },
      [guideId],
    );

    if (!isEnabled) return null;

    return (
      <div className="overflow-hidden rounded-2xl border bg-background shadow-xs">
        <div className="flex items-center gap-3 p-6 shadow-xs">
          {isPending ? (
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-56" />
            </div>
          ) : (
            <div className="flex-1 space-y-1">
              <div className="flex items-start gap-2">
                <p className="text-base font-semibold">{data?.data?.name}</p>
                {!data?.data?.teamId && (
                  <Badge
                    variant="outline"
                    className="border-amber-200 bg-amber-100"
                  >
                    Suggested
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {data?.data?.items?.length} items
                </span>
                <span>•</span>
                <span className="font-medium">{formatUSD(0)} Estimated</span>
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="destructive"
            onClick={() => queryParams({ del: "guideId" })}
          >
            <X /> Close
          </Button>
        </div>

        {/* item grid */}
        <div className="p-6">
          <ProductGrid
            items={items}
            form={form}
            layout={layout}
            sortable={!!data?.data?.teamId}
            onMoveComplete={(newItems) => handleMove(newItems)}
          />
        </div>
      </div>
    );
  },
});
