"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useProducts } from "@/hooks/use-product";
import { STATUS_MAP } from "@/lib/constants/product";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { Pagination } from "@/components/admin/pagination";
import { ProductAction } from "@/components/admin/product-actions";

export const PageClient = () => {
  const { searchParams, queryParams } = useRouterStuff();

  const { data, error, isPending, isError } = useProducts(
    searchParams.toString()
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
        <div className="grid grid-cols-2 gap-4 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {data?.data?.map((product, i) => {
            const map = STATUS_MAP[product.status as keyof typeof STATUS_MAP];
            const img =
              product.image ||
              `https://api.dicebear.com/9.x/initials/svg?seed=${product.title}&scale=80`;

            const onOffer =
              product.offerPrice && product.offerPrice < product.price!;
            return (
              <Card
                size="sm"
                key={i}
                className="rounded-2xl pt-0 hover:ring-2 hover:ring-offset-1 relative hover:ring-offset-background transition ease-out"
                style={{ "--color": map.color } as React.CSSProperties}
              >
                <div className="bg-background absolute left-2 top-2 z-2 rounded-xl">
                  <Badge className="bg-(--color)/10 text-(--color) rounded-xl h-6 text-sm">
                    <map.icon className="size-3.5" />
                    {map.label}
                  </Badge>
                </div>

                <ProductAction product={product} />

                <div className="rounded-t-[0.5rem] overflow-hidden relative">
                  <Image
                    width={600}
                    height={900}
                    src={img}
                    alt={product.title}
                    loading="lazy"
                    className="relative z-1 w-full object-cover transition ease-out aspect-square rounded-lg"
                  />
                </div>
                <CardContent className="mt-auto space-y-1">
                  <div className="flex gap-2 flex-wrap">
                    {product.categories?.map((cat) => (
                      <Badge
                        key={cat}
                        className="rounded-xl h-6 text-sm"
                        variant="outline"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle>{product.title}</CardTitle>
                  <CardDescription className="text-base space-x-2">
                    <span className={onOffer ? "line-through" : ""}>
                      {product.price}
                    </span>
                    {onOffer && <span>{product.offerPrice}</span>}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* pagination */}
      <Pagination
        page={page}
        total={total}
        totalPages={totalPages}
        limit={limit}
        onPageChange={(page) => queryParams({ set: { page: page.toString() } })}
      />
    </>
  );
};
