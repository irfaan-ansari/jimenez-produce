"use client";

import React from "react";

import { SquarePen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { AdminProductResponse } from "@/lib/types";
import { STATUS_MAP } from "@/lib/constants/product";
import { useAdminProducts } from "@/hooks/use-product";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { formatUSD, getInitialsAvatar } from "@/lib/utils";
import { Pagination } from "@/components/admin/pagination";
import { ProductDialog } from "@/components/admin/product-dialog";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const PageClient = () => {
  const { searchParams, queryParams } = useRouterStuff();

  const { data, error, isPending, isError } = useAdminProducts(
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
    <div className="flex-1 space-y-3">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 2xl:grid-cols-6">
        {(data as AdminProductResponse)?.data?.map((product, i) => {
          const map = STATUS_MAP[product.status as keyof typeof STATUS_MAP];
          const defaultImage = getInitialsAvatar(product.title);
          return (
            <Card
              size="sm"
              key={i}
              className="relative flex h-full flex-col rounded-xl pt-0! transition ease-out hover:ring-2 hover:ring-offset-1 hover:ring-offset-background"
              style={{ "--color": map.color } as React.CSSProperties}
            >
              {/* actions */}

              <ProductDialog product={product}>
                <Button
                  variant="outline"
                  size="icon-xs"
                  className="absolute top-2 right-2 z-2 h-6! rounded-sm shadow-sm"
                >
                  <SquarePen />
                </Button>
              </ProductDialog>

              <div className="absolute top-2 left-2 z-2 flex flex-col gap-1">
                {/* status */}
                <Badge className="h-6 rounded-md  border border-(--color)/20 bg-background/80 text-sm text-(--color) shadow-sm backdrop-blur-2xl">
                  <map.icon className="size-3.5" />
                  {map.label}
                </Badge>
              </div>

              <div className="relative aspect-[1.6/1] overflow-hidden rounded-xl bg-secondary">
                {product.image ? (
                  <img
                    width={100}
                    height={100}
                    src={product.image!}
                    alt={product.title}
                    loading={i <= 10 ? "eager" : "lazy"}
                    className="relative z-1 aspect-[1.6/1] h-auto w-full rounded-lg object-contain transition ease-out"
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
              <CardContent className="flex flex-1 flex-col space-y-2">
                <div className="flex items-center gap-2">
                  {/* tax status */}
                  {product.isTaxable && (
                    <Badge className="h-5 rounded-sm">Taxable</Badge>
                  )}
                  {/* item code */}
                  <Badge className="h-5 rounded-sm">{product.identifier}</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {product.categories?.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs leading-tight font-medium text-muted-foreground uppercase not-last:border-r-2 not-last:pr-2"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <CardTitle className="mt-auto font-semibold">
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
    </div>
  );
};
