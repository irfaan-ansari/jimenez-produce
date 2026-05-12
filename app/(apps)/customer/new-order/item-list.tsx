import React from "react";
import { cn } from "@/lib/utils";
import {
  LAYOUT_MAP,
  LayoutType,
  useLayoutPreference,
} from "@/hooks/use-layout-prefrence";
import { ProductItem } from "./product-item";
import { formOpt } from "./order-form-options";
import { withForm } from "@/hooks/form-context";
import { OrderGuideList } from "./order-guide";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { CategoryFilter } from "./category-filter";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useInfiniteProductsCustomer } from "@/hooks/use-product";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const ItemList = withForm({
  ...formOpt,

  render: function Render({ form }) {
    const { searchParamsObj } = useRouterStuff();
    const [layout, setLayout] = useLayoutPreference();
    const [filter, setFilter] = React.useState<Record<string, string>>({});

    const queryString = React.useMemo(() => {
      const { guideId, ...rest } = searchParamsObj;

      return new URLSearchParams({
        ...filter,
        ...rest,
      }).toString();
    }, [filter, searchParamsObj]);

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

    const layoutConfig = LAYOUT_MAP[layout];

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
      <div
        data-layout={layout}
        className="group/card @container min-h-svh min-w-0 flex-1 space-y-5"
      >
        {/* toolbar */}
        <div className="flex items-center justify-between gap-3">
          <CategoryFilter filter={filter} setFilter={setFilter} />
          <LayoutSwitcher layout={layout} onChange={setLayout} />
        </div>

        {/* guide list */}
        <OrderGuideList form={form} layout={layoutConfig} />

        {/* products state */}
        <ProductsState
          isError={isError}
          isPending={isPending}
          error={error}
          hasProducts={mappedProduct?.length > 0}
        />

        {/* conditions all products render */}

        <div className={`grid flex-1 text-base ${layoutConfig.className}`}>
          {mappedProduct.map((product) => (
            <ProductItem
              key={product.productId}
              product={product}
              form={form}
            />
          ))}
        </div>

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

const LayoutSwitcher = React.memo(
  ({
    layout,
    onChange,
  }: {
    layout: LayoutType;
    onChange: (v: LayoutType) => void;
  }) => {
    return (
      <ToggleGroup
        type="single"
        variant="outline"
        value={layout}
        onValueChange={(v) => {
          if (!v) return;
          onChange(v as LayoutType);
        }}
      >
        {Object.values(LAYOUT_MAP).map((item) => {
          const Icon = item.icon;

          return (
            <ToggleGroupItem
              key={item.value}
              value={item.value}
              className="data-[state=on]:bg-sidebar-accent data-[state=on]:text-primary-foreground"
            >
              <Icon />
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    );
  },
);

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
      <div className="rounded-2xl bg-background py-20">
        <EmptyComponent variant="error" title={error?.message} />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="rounded-2xl bg-background py-20">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!hasProducts) {
    return (
      <div className="rounded-2xl bg-background py-20">
        <EmptyComponent variant="empty" />
      </div>
    );
  }

  return null;
}
