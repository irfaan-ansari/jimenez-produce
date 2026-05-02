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
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { BlurFade } from "@/components/ui/blur-fade";

export const PageClient = () => {
  const { searchParams, queryParams } = useRouterStuff();

  const {
    data,
    error,
    isPending,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteProducts(searchParams.toString());

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, true);

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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 2xl:grid-cols-6">
        {products.map((product, i) => {
          return (
            <BlurFade delay={0.05} key={i} direction="up">
              <Card
                size="sm"
                className="relative h-full rounded-xl pt-0! transition ease-out hover:ring-2 hover:ring-offset-1 hover:ring-offset-background"
              >
                <div className="relative aspect-[1.6/1] overflow-hidden rounded-t-[0.5rem] bg-secondary">
                  {product.image && (
                    <img
                      width={400}
                      height={400}
                      src={product.image!}
                      alt={product.title}
                      loading={i <= 10 ? "eager" : "lazy"}
                      className="relative z-1 aspect-[1.6/1] w-full rounded-lg object-contain transition ease-out"
                    />
                  )}
                </div>
                <CardContent className="mt-auto space-y-2">
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {product.categories?.map((cat) => (
                      <span
                        key={cat}
                        className="text-sm text-muted-foreground inline-block leading-tight not-last:pr-2 not-last:border-r-2"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="font-semibold">
                    {product.title}
                  </CardTitle>
                  <CardTitle className="text-base! font-bold text-primary">
                    {formatUSD(product.basePrice ?? 0)}
                  </CardTitle>
                </CardContent>
              </Card>
            </BlurFade>
          );
        })}
      </div>
      {/* INFINITE SCROLL SENTINEL */}
      <div
        ref={loadMoreRef}
        className="col-span-full flex min-h-10 w-full justify-center"
      >
        {(isFetchingNextPage || isPending) && "Loading..."}
      </div>
    </div>
  );
};
