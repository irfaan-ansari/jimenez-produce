"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useProducts } from "@/hooks/use-product";
import { STATUS_MAP } from "@/lib/constants/product";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { Pagination } from "@/components/admin/pagination";
import { ProductAction } from "@/app/(apps)/admin/products/product-actions";
import { AdminProductResponse } from "@/lib/types";
import { formatUSD, getInitialsAvatar } from "@/lib/utils";

export const PageClient = () => {
  const { searchParams, queryParams } = useRouterStuff();

  const { data, error, isPending, isError } = useProducts(
    searchParams.toString(),
  );

  // loading
  if (isPending) return <LoadingSkeleton />;

  // error
  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  // empty
  if (data?.data?.length === 0) return <EmptyComponent variant="empty" />;

  const { page, total, totalPages, limit } = data.pagination;

  // data
  return (
    <>
      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 2xl:grid-cols-6">
          {(data as AdminProductResponse)?.data?.map((product, i) => {
            const map = STATUS_MAP[product.status as keyof typeof STATUS_MAP];
            const defaultImage = getInitialsAvatar(product.title);
            return (
              <Card
                size="sm"
                key={i}
                className="relative flex flex-col h-full rounded-xl pt-0! transition ease-out hover:ring-2 hover:ring-offset-1 hover:ring-offset-background"
                style={{ "--color": map.color } as React.CSSProperties}
              >
                {/* actions */}
                <ProductAction product={product} />

                <div className="absolute top-2 left-2 z-2 flex flex-col gap-1">
                  {/* status */}
                  <Badge className="h-6 rounded-md  backdrop-blur-2xl bg-(--color)/10 shadow-sm border border-(--color)/20 text-sm text-(--color)">
                    <map.icon className="size-3.5" />
                    {map.label}
                  </Badge>

                  {/* tax status */}
                  {product.isTaxable && (
                    <Badge
                      className="h-6 rounded-md text-sm backdrop-blur-md border shadow-sm bg-background"
                      variant="secondary"
                    >
                      Taxable
                    </Badge>
                  )}
                </div>

                <div className="relative aspect-[1.6/1] overflow-hidden rounded-xl bg-secondary">
                  {product.image ? (
                    <img
                      width={100}
                      height={100}
                      src={product.image!}
                      alt={product.title}
                      loading={i <= 10 ? "eager" : "lazy"}
                      className="relative z-1 aspect-[1.6/1] w-full h-auto rounded-lg object-contain transition ease-out"
                    />
                  ) : (
                    <img
                      width={100}
                      height={100}
                      src={defaultImage}
                      alt={product.title}
                      loading={i <= 10 ? "eager" : "lazy"}
                      className="relative z-1 w-full rounded-lg object-cover transition ease-out"
                    />
                  )}
                </div>
                <CardContent className="flex flex-col flex-1 space-y-2">
                  <Badge className="rounded-sm h-5">{product.identifier}</Badge>
                  <div className="flex flex-wrap gap-1">
                    {product.categories?.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs uppercase text-muted-foreground font-medium not-last:pr-2 not-last:border-r-2 leading-tight"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="font-semibold mt-auto">
                    {product.title}
                  </CardTitle>

                  <span className="text-base font-semibold text-primary">
                    {formatUSD(product.basePrice)}:
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* pagination */}
      {!isPending && !isError && (
        <Pagination
          page={page}
          total={total}
          totalPages={totalPages}
          limit={limit}
          onPageChange={(page) =>
            queryParams({ set: { page: page.toString() } })
          }
        />
      )}
    </>
  );
};
