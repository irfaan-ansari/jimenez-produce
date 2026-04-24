"use client";

import { formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useInfiniteProducts } from "@/hooks/use-product";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const PageClient = () => {
  const { searchParams, queryParams } = useRouterStuff();

  const { data, error, isPending, isError } = useInfiniteProducts(
    searchParams.toString(),
  );

  // loading
  if (isPending) return <LoadingSkeleton />;

  // error
  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  // empty
  if (products?.length === 0) return <EmptyComponent variant="empty" />;

  // data
  return (
    <div className="flex-1 space-y-3">
      <div className="grid grid-cols-2 gap-4 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map((product, i) => {
          return (
            <Card
              size="sm"
              key={i}
              className="rounded-2xl pt-0! hover:ring-2 hover:ring-offset-1 relative hover:ring-offset-background transition ease-out"
            >
              <div className="rounded-t-[0.5rem] overflow-hidden relative aspect-[1.6/1] bg-secondary">
                {product.image && (
                  <img
                    width={400}
                    height={400}
                    src={product.image!}
                    alt={product.title}
                    loading={i <= 10 ? "eager" : "lazy"}
                    className="relative z-1 w-full object-contain transition ease-out aspect-[1.6/1] rounded-lg"
                  />
                )}
              </div>
              <CardContent className="mt-auto space-y-2">
                <div className="flex gap-x-2 gap-y-1 flex-wrap">
                  {product.categories?.map((cat) => (
                    <Badge
                      key={cat}
                      className="rounded-lg h-6 text-sm"
                      variant="secondary"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="font-semibold">{product.title}</CardTitle>
                <CardTitle className="font-bold text-primary text-base!">
                  {formatUSD(product.basePrice ?? 0)}
                </CardTitle>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
