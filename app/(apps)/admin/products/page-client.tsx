"use client";

import React from "react";
import { ImageOff, SquarePen } from "lucide-react";
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
import { formatUSD } from "@/lib/utils";
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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-4 xl:grid-cols-4 2xl:grid-cols-6">
        {(data as AdminProductResponse)?.data?.map((product, i) => {
          const map = STATUS_MAP[product.status as keyof typeof STATUS_MAP];

          return (
            <Card
              size="sm"
              key={i}
              className="relative flex flex-col border rounded-xl pt-0! transition ease-out hover:ring-2 hover:ring-offset-1 hover:ring-offset-background"
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

              <div className="absolute flex flex-col gap-1 top-2 left-2 z-2">
                {/* status */}
                <Badge className="h-6 rounded-md  border border-(--color)/20 bg-background/80 text-sm text-(--color) shadow-sm backdrop-blur-2xl">
                  <map.icon className="size-3.5" />
                  {map.label}
                </Badge>
              </div>

              <div className="relative inline-flex items-center justify-center overflow-hidden aspect-video rounded-t-xl bg-secondary">
                {product.image ? (
                  <img
                    width={100}
                    height={100}
                    src={product.image!}
                    alt={product.title}
                    loading={i <= 10 ? "eager" : "lazy"}
                    className="absolute inset-0 object-contain transition ease-out mix-blend-multiply size-full"
                  />
                ) : (
                  <ImageOff className="size-6 opacity-40" />
                )}
              </div>
              <CardContent className="relative flex flex-col flex-1 pt-1.5 space-y-1.5">
                <div className="absolute flex items-center gap-2 -top-6 left-4">
                  {/* tax status */}
                  {product.isTaxable && (
                    <Badge className="h-5 rounded-sm">Taxable</Badge>
                  )}
                  {/* item code */}
                  <Badge className="h-5 rounded-sm">{product.identifier}</Badge>
                </div>

                <div className="text-xs font-medium uppercase text-muted-foreground">
                  {product.categories?.join(" • ")}
                </div>

                <CardTitle className="mt-auto font-semibold">
                  {product.title}
                </CardTitle>

                <div className="space-y-0.5">
                  {product.pack && product.unitSize && <div className="text-xs uppercase font-medium text-muted-foreground">
                    {product.pack}/{product.unitSize}
                    <span className="ml-1">
                      {product.unit}</span>
                  </div>}
                  <div className="font-bold text-primary">
                    {formatUSD(product.basePrice)}
                    {product.unit && (
                      <span className="text-muted-foreground ml-1 text-[10px]">
                        /{product.unit}
                      </span>
                    )}
                  </div>
                </div>
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
