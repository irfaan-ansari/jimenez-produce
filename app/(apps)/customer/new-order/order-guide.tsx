import React from "react";

import Link from "next/link";
import { X } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import { File } from "@duo-icons/react";
import { ProductItem } from "./item-card";
import { Badge } from "@/components/ui/badge";
import { formOpt } from "./order-form-options";
import { withForm } from "@/hooks/form-context";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { useInfiniteOrderGuides, useOrderGuide } from "@/hooks/use-orders";
import { OrderGuideSelector } from "@/components/admin/order-guide-selector";

export const OrderGuideButton = () => {
  const { data, isError, isPending } = useInfiniteOrderGuides("");

  const { queryParams, searchParamsObj } = useRouterStuff();

  const totalRecord = React.useMemo(() => {
    return data?.pages?.[0]?.pagination?.total ?? 0;
  }, [data]);

  if (totalRecord <= 0 && !isPending && !isError)
    return (
      <Button
        size="xl"
        type="button"
        variant="secondary"
        className="rounded-lg bg-yellow-500 hover:bg-yellow-500/90 aria-expanded:bg-yellow-500/90 [&>svg]:size-5!"
        asChild
      >
        <Link href="/customer/order-guides/new">
          <File /> New order guide
        </Link>
      </Button>
    );

  return (
    <OrderGuideSelector
      value={searchParamsObj.guideId}
      onValueChange={(value) =>
        queryParams({ set: { guideId: String(value.id) } })
      }
    >
      <Button
        size="xl"
        type="button"
        variant="secondary"
        className="rounded-lg bg-yellow-500 hover:bg-yellow-500/90 aria-expanded:bg-yellow-500/90 [&>svg]:size-5!"
      >
        <File /> Order Guide ({totalRecord})
      </Button>
    </OrderGuideSelector>
  );
};

/**
 *
 * @param param0
 * @returns
 */
export const OrderGuideList = withForm({
  ...formOpt,
  props: {} as Record<string, any>,
  render: function Render({ form, layout }) {
    const { searchParamsObj, queryParams } = useRouterStuff();

    const { data, isEnabled, isPending, isError, error } = useOrderGuide(
      searchParamsObj.guideId,
    );

    if (!isEnabled) return null;

    if (isError)
      return (
        <div className="flex items-center justify-center bg-background  p-6 shadow-sm">
          <EmptyComponent variant="error" title={error.message} />
        </div>
      );

    const total =
      data?.data?.items?.reduce(
        (acc, item) => acc + Number(item.quantity!) * Number(item.finalPrice!),
        0,
      ) ?? 0;

    return (
      <div className="overflow-hidden rounded-2xl border bg-background shadow-xs">
        <div className="flex items-center gap-3 p-6 shadow-xs">
          {isPending ? (
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-56" />
            </div>
          ) : (
            <div className="flex-1 space-y-1">
              <div className="flex items-start gap-2">
                <p className="text-base font-semibold">{data?.data?.name}</p>
                {!data?.data?.teamId && (
                  <Badge
                    variant="outline"
                    className="border-amber-200 bg-amber-100"
                  >
                    Suggested
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {data?.data?.items?.length} items
                </span>

                <span>•</span>
                <span className="font-medium">
                  {formatUSD(total)} Estimated
                </span>
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="destructive"
            onClick={() => queryParams({ del: "guideId" })}
          >
            <X /> Close
          </Button>
        </div>
        {isPending ? (
          <div className="py-20">
            <LoadingSkeleton />
          </div>
        ) : (
          <div
            className={`flex-1 text-base overflow-auto no-scrollbar p-6 grid
            ${layout?.className}
            `}
          >
            {data?.data?.items.map((item) => {
              const {
                productId,
                title,
                finalPrice,
                quantity,
                image,
                type,
                identifier,
                pack,
                categories,
                isTaxable,
              } = item;

              return (
                <ProductItem
                  key={productId}
                  product={{
                    productId,
                    title,
                    price: finalPrice,
                    total: finalPrice,
                    quantity: quantity || "0",
                    image,
                    type,
                    identifier,
                    pack,
                    categories: categories!,
                    isTaxable: !!isTaxable,
                    isGuide: !!data?.data?.teamId,
                    isSuggested: !data?.data?.teamId,
                  }}
                  form={form}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  },
});
