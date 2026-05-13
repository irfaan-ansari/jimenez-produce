import React from "react";
import { ProductsState } from "./card-badge";
import { ProductGrid } from "./product-grid";
import { formOpt } from "./order-form-options";
import { withForm } from "@/hooks/form-context";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useInfiniteProductsCustomer } from "@/hooks/use-product";
import { LoadingSkeleton } from "@/components/admin/placeholder-component";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useOrderUIStore } from "@/lib/store/order-store";

export const ItemList = withForm({
  ...formOpt,
  props: {} as { layout: string; filters: Record<string, string> },
  render: function Render({ form, layout, filters }) {
    const isSelecting = useOrderUIStore((s) => s.isSelecting);
    const setIsSelecting = useOrderUIStore((s) => s.setIsSelecting);

    const { searchParamsObj } = useRouterStuff();
    const queryString = React.useMemo(() => {
      const { guideId, ...rest } = searchParamsObj;

      return new URLSearchParams({
        ...filters,
        ...rest,
      }).toString();
    }, [filters, searchParamsObj]);

    const {
      data,
      isError,
      error,
      isPending,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    } = useInfiniteProductsCustomer(queryString);

    const loadMoreRef = useInfiniteScroll(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, true);

    const mappedProduct = React.useMemo(() => {
      return (
        data?.pages
          .flatMap((page) => page.data)
          .map((product) => {
            return {
              productId: product.id,
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
              lastPurchased: {
                id: product.lastPurchased.id,
                quantity: product.lastPurchased.quantity,
                createdAt: product.lastPurchased.createdAt,
              },
              isGuide: product.isGuide,
              isSuggested: product.isSuggested,
            };
          }) ?? []
      );
    }, [data]);

    return (
      <div className="space-y-6">
        {searchParamsObj.guideId && (
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              All products
            </span>
            <span className="flex-1 border-b" />
            <Button
              className="rounded-lg"
              variant={isSelecting ? "destructive" : "default"}
              onClick={() => setIsSelecting(!isSelecting)}
            >
              {isSelecting ? (
                <>
                  <X /> Cancel
                </>
              ) : (
                <>
                  <Plus /> New guide
                </>
              )}
            </Button>
          </div>
        )}

        <ProductsState
          isError={isError}
          isPending={isPending}
          error={error}
          hasProducts={mappedProduct?.length > 0}
        />

        {/* item grid */}
        <ProductGrid
          items={mappedProduct}
          form={form}
          layout={layout}
          selectable={isSelecting}
        />

        {/* render grid with sortable */}
        <div
          ref={loadMoreRef}
          className="col-span-full flex min-h-10 w-full justify-center"
        >
          {isFetchingNextPage && <LoadingSkeleton />}
        </div>
      </div>
    );
  },
});
