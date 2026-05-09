"use client";

import React from "react";
import { formOpt } from "./order-form-options";
import { withForm } from "@/hooks/form-context";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { type CustomerProductType } from "@/lib/types";
import { CategoryPills, ProductItem } from "./item-card";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { LayoutGrid, TextAlignJustify } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useInfiniteProductsCustomer } from "@/hooks/use-product";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { OrderGuideList } from "./order-guide";

const LAYOUTS = [
  {
    value: "list",
    icon: TextAlignJustify,
    className: "grid-cols-1 ",
    itemClassName: "",
  },
  {
    value: "grid",
    icon: LayoutGrid,
    className:
      "grid-cols-1 *:rounded-xl @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @8xl:grid-cols-8 gap-4",
    itemClassName: "",
  },
];

export const ItemList = withForm({
  ...formOpt,

  render: function Render({ form }) {
    const { searchParamsObj } = useRouterStuff();
    const [filter, setFilter] = React.useState<Record<string, any>>({});
    const [layout, setLayout] = React.useState<"list" | "grid">("grid");

    const query = new URLSearchParams({ ...filter, ...searchParamsObj });

    const {
      data,
      isError,
      error,
      isPending,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    } = useInfiniteProductsCustomer(query?.toString());

    const products = data?.pages.flatMap((page) => page.data) ?? [];

    const loadMoreRef = useInfiniteScroll(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, true);

    const handleLayoutChange = (newLayout: string) => {
      const val = newLayout as "list" | "grid";
      setLayout(val);
      localStorage.setItem("layout-state", val);
    };

    React.useEffect(() => {
      const savedLayout = localStorage.getItem("layout-state") as
        | "list"
        | "grid";
      if (savedLayout) {
        setLayout(savedLayout);
      }
    }, []);

    return (
      <div
        data-layout={layout}
        className="group/card @container min-h-svh min-w-0 flex-1 space-y-5"
      >
        <div className="flex gap-3 justify-between items-center">
          <CategoryPills filter={filter} setFilter={setFilter} />

          <ToggleGroup
            type="single"
            variant="outline"
            value={layout}
            onValueChange={(v) => {
              handleLayoutChange(v || "grid");
            }}
          >
            {LAYOUTS.map(({ value, icon }, i) => {
              const Icon = icon;
              return (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  className="data-[state=on]:bg-sidebar-accent data-[state=on]:text-primary-foreground"
                >
                  <Icon />
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>

        {/* guide list */}
        <OrderGuideList
          form={form}
          layout={LAYOUTS.find((l) => l.value === layout)}
        />

        {/* all products */}
        {searchParamsObj.guideId && (
          <div className="flex gap-3 items-center">
            <span className="uppercase font-medium text-sm text-muted-foreground">
              All Products ({data?.pages?.[0]?.pagination?.total})
            </span>
            <span className="flex-1 border-b"></span>
          </div>
        )}

        {/* error component */}
        {isError && (
          <div className="py-20 rounded-2xl bg-background">
            <EmptyComponent variant="error" title={error?.message} />
          </div>
        )}

        {/* empty component */}
        {isPending && (
          <div className="py-20 bg-background rounded-2xl">
            <LoadingSkeleton />
          </div>
        )}

        {/* products */}
        {products.length > 0 ? (
          <div
            className={`flex-1 text-base overflow-auto no-scrollbar px-0 grid
            ${LAYOUTS.find((l) => l.value === layout)?.className}
            `}
          >
            {products?.map((product, idx) => (
              <ProductItem
                key={product.id}
                product={product as CustomerProductType}
                form={form}
              />
            ))}
          </div>
        ) : (
          !isError &&
          !isPending && (
            <div className="py-20 bg-background rounded-2xl">
              <EmptyComponent variant="empty" />
            </div>
          )
        )}

        {/* INFINITE SCROLL SENTINEL */}
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
