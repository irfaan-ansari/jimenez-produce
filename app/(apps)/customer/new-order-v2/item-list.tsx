import React from "react";
import { ProductGrid } from "./product-grid";
import { formOpt } from "./order-form-options";
import { withForm } from "@/hooks/form-context";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useInfiniteProductsCustomer } from "@/hooks/use-product";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useOrderUIStore } from "@/lib/store/order-store";

export const ItemList = withForm({
  ...formOpt,

  render: function Render({ form }) {
    const layout = useOrderUIStore((s) => s.layout);
    const isSelecting = useOrderUIStore((s) => s.isSelecting);

    const queryString = new URLSearchParams({}).toString();

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
        <ProductsState
          isError={isError}
          isPending={isPending}
          error={error}
          hasProducts={mappedProduct?.length > 0}
        />

        {/* item grid */}
        <div
          data-layout={layout}
          className="group/card @container min-h-svh min-w-0 flex-1 space-y-5"
        >
          <ProductGrid
            items={mappedProduct}
            form={form}
            layout={layout}
            selectable={isSelecting}
          />
        </div>
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

function ProductsState({
  isError,
  isPending,
  error,
  hasProducts,
}: {
  isError: boolean;
  isPending: boolean;
  error: Error | null;
  hasProducts: boolean;
}) {
  if (isError) {
    return (
      <div className="rounded-2xl border bg-background py-20">
        <EmptyComponent variant="error" title={error?.message} />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="rounded-2xl border bg-background py-20">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!hasProducts) {
    return (
      <div className="rounded-2xl border bg-background py-20">
        <EmptyComponent variant="empty" />
      </div>
    );
  }

  return null;
}
