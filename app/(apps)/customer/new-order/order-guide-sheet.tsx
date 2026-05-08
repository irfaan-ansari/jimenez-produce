import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { Eye, EyeOff, Star, X } from "lucide-react";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { OrderGuide, useInfiniteOrderGuides } from "@/hooks/use-orders";

export const OrderGuideSheet = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);

  const {
    data,
    isError,
    error,
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <ButtonGroup>
        <SheetTrigger asChild>
          <Button
            type="button"
            size="xl"
            className="rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
          >
            <Star className="fill-primary-foreground" /> Order Guide
          </Button>
        </SheetTrigger>
        <ButtonGroupSeparator />
        <Button
          size="icon-xl"
          type="button"
          className="bg-sidebar-accent hover:bg-sidebar-accent/80"
          onClick={() => {
            if (searchParamsObj.orderGuideId) {
              queryParams({ del: "orderGuideId" });
            } else {
              setOpen(true);
            }
          }}
        >
          {searchParamsObj.orderGuideId ? <X /> : totalRecord}
        </Button>
      </ButtonGroup>

      <SheetContent className="gap-0">
        <SheetHeader className="gap-0 border-b">
          <SheetTitle className="text-lg font-semibold">Order guide</SheetTitle>
        </SheetHeader>

        <div className="no-scrollbar flex-1 gap-2 space-y-2 overflow-y-auto p-4">
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
            <GuideItem
              key={item.id}
              item={item}
              open={open}
              setOpen={setOpen}
            />
          ))}

          {/* loading ref */}
          <div
            ref={loadMoreRef}
            className="col-span-full flex min-h-10 w-full justify-center"
          >
            {isFetchingNextPage && <LoadingSkeleton />}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

/**
 * This component is used to display the order guide item.
 * @param param0
 * @returns
 */
const GuideItem = ({
  item,
  open,
  setOpen,
}: {
  item: OrderGuide;
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  const { searchParamsObj, queryParams } = useRouterStuff();
  const isActive = searchParamsObj.orderGuideId === String(item.id);
  return (
    <div key={item.id} className="rounded-2xl border bg-muted/50 p-4 relative">
      {!item.teamId && (
        <Badge className="absolute right-4 top-4 bg-amber-100 text-foreground border-amber-200">
          Suggested
        </Badge>
      )}
      <p className="font-semibold mb-2 text-base">{item.name}</p>
      <p className="text-muted-foreground text-sm">{item.description}</p>
      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1">
          <span className="font-medium">{item.itemCount} items</span>
        </div>

        <Button
          size="xs"
          type="button"
          data-active={isActive}
          variant={isActive ? "outline" : "default"}
          className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-primary-foreground"
          onClick={() => {
            if (isActive) {
              queryParams({ del: "orderGuideId" });
            } else {
              queryParams({ set: { orderGuideId: String(item.id) } });
            }
            setOpen(false);
          }}
        >
          {isActive ? (
            <>
              <EyeOff /> Hide
            </>
          ) : (
            <>
              <Eye /> View
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
