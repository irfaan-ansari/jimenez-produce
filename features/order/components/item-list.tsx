import React from "react";
import { ProductGrid } from "./product-grid";
import { formOpt } from "./order-form-options";
import { withForm } from "@/hooks/form-context";

import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QueryState } from "@/components/admin/query-state";

import { useProducts } from "../data/products";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useOrderUIStore } from "@/features/order/store/order-store";

export const ItemList = withForm({
  ...formOpt,

  render: function Render({ form }) {
    const filter = useOrderUIStore((s) => s.filter);

    const queryString = new URLSearchParams(filter as any).toString();

    const {
      data,
      isError,
      error,
      isPending,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    } = useProducts(queryString);

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
              identifier: product.identifier,
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
            };
          }) ?? []
      );
    }, [data]);

    return (
      <div className="space-y-6">
        <QueryState
          isPending={isPending}
          error={error}
          isError={isError}
          isEmpty={mappedProduct?.length === 0}
          className="py-20"
        >
          <ProductGrid items={mappedProduct} form={form} />
        </QueryState>
        <div
          ref={loadMoreRef}
          className="flex justify-center w-full col-span-full min-h-10"
        >
          {hasNextPage && (
            <Button
              size="lg"
              type="button"
              onClick={() => fetchNextPage()}
              className="w-32 rounded-lg"
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <>
                  <Loader className="animate-spin" />
                  Loading...
                </>
              ) : (
                "Load more"
              )}
            </Button>
          )}
        </div>
      </div>
    );
  },
});
