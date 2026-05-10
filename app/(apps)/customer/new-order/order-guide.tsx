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
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useInfiniteOrderGuides, useOrderGuide } from "@/hooks/use-orders";

export const OrderGuideButton = () => {
  const [open, setOpen] = React.useState(false);

  const {
    data,
    isError,
    error,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteOrderGuides("");

  const { queryParams, searchParamsObj } = useRouterStuff();

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, open);

  const guides = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const totalRecord = React.useMemo(() => {
    return data?.pages?.[0]?.pagination?.total ?? 0;
  }, [data]);

  if (totalRecord <= 0 && !isPending && !isError)
    return (
      <Button
        size="xl"
        type="button"
        variant="secondary"
        className="rounded-lg aria-expanded:bg-yellow-500/90 [&>svg]:size-5! bg-yellow-500 hover:bg-yellow-500/90"
        asChild
      >
        <Link href="/customer/order-guides/new">
          <File /> New order guide
        </Link>
      </Button>
    );

  return (
    <PopoverXDrawer
      open={open}
      setOpen={setOpen}
      trigger={
        <Button
          size="xl"
          type="button"
          variant="secondary"
          className="rounded-lg aria-expanded:bg-yellow-500/90 [&>svg]:size-5! bg-yellow-500 hover:bg-yellow-500/90"
        >
          <File /> Order Guide ({totalRecord})
        </Button>
      }
      className="data-[slot=popover-content]:w-80 *:gap-0 data-[slot=popover-content]:max-w-80 data-[slot=popover-content]:max-h-[min(calc(var(--radix-popover-content-available-height)-200px),80svh)] data-[slot=popover-content]:overflow-y-auto data-[slot=popover-content]:no-scrollbar"
    >
      {/* error */}
      {isError && (
        <EmptyComponent
          variant="error"
          title={error.message}
          description="Please try again later"
        />
      )}

      {/* empty */}
      {!isFetchingNextPage && !isError && guides?.length <= 0 && (
        <EmptyComponent variant="empty" title="No order guide found" />
      )}

      {/* items */}
      {guides?.map((item) => (
        <Button
          key={item.id}
          variant={
            searchParamsObj.guideId === String(item.id) ? "secondary" : "ghost"
          }
          className="h-auto py-2 relative justify-start flex-col items-start"
          onClick={() => {
            queryParams({ set: { guideId: String(item.id) } });
            setOpen(false);
          }}
        >
          {!item.teamId && (
            <Badge className="absolute top-2 right-2 border-amber-200 bg-amber-100 text-foreground">
              Suggested
            </Badge>
          )}

          {item.name}
          <span className="text-xs font-medium text-primary">
            {item.itemCount} items
          </span>
        </Button>
      ))}

      {/* loading ref */}
      <div
        ref={loadMoreRef}
        className="col-span-full flex min-h-10 w-full justify-center"
      >
        {isFetchingNextPage && <LoadingSkeleton />}
      </div>
    </PopoverXDrawer>
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
        <div className="flex items-center justify-center p-6  bg-background shadow-sm">
          <EmptyComponent variant="error" title={error.message} />
        </div>
      );

    const total =
      data?.data?.items?.reduce(
        (acc, item) => acc + Number(item.quantity!) * Number(item.finalPrice!),
        0,
      ) ?? 0;

    return (
      <div className="bg-background overflow-hidden shadow-xs border rounded-2xl">
        <div className="flex items-center gap-3 p-6 shadow-xs">
          {isPending ? (
            <div className="space-y-2 w-full">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-56" />
            </div>
          ) : (
            <div className="space-y-1 flex-1">
              <div className="flex gap-2 items-start">
                <p className="font-semibold text-base">{data?.data?.name}</p>
                {!data?.data?.teamId && (
                  <Badge
                    variant="outline"
                    className="bg-amber-100 border-amber-200"
                  >
                    Suggested
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 items-center text-sm">
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
