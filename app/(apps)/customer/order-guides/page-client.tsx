"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronsUpDown,
  GripVerticalIcon,
  ImageOff,
  LayoutGrid,
  Search,
  SquarePen,
  TextAlignJustify,
  Trash2,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

import {
  OrderGuideItem,
  useOrderGuide,
  useOrderGuides,
} from "@/hooks/use-orders";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/components/reui/sortable";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { cn, formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";
import { deleteOrderGuide } from "@/server/order-guide";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { Pagination } from "@/components/admin/pagination";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ProductSelectorCustomer } from "@/components/admin/product-selector-customer";

const LAYOUTS = [
  {
    value: "list",
    icon: TextAlignJustify,
    className: "grid-cols-1 gap-1",
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

export const OrderGuidesClientPage = () => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const { queryParams } = useRouterStuff();
  const { data: guide, isPending, isError, error } = useOrderGuides();

  if (isPending) return <LoadingSkeleton />;
  if (isError) return <EmptyComponent variant="error" title={error.message} />;

  const { data } = guide;

  if (data?.length === 0)
    return <EmptyComponent variant="empty" title="No order guides found" />;

  const { page, total, totalPages, limit } = guide.pagination;

  const hanldeDelete = (id: number) => {
    confirm.delete({
      title: "Delete order guide",
      description: "Are you sure you want to delete this order guide?",
      action: async () => {
        const toastId = toast.loading("Please wait...");
        const { success, error } = await deleteOrderGuide(id);

        if (success) {
          toast.success("Order guide deleted successfully", { id: toastId });

          queryClient.invalidateQueries({
            queryKey: ["customer-order-guides"],
          });
        } else {
          toast.error(error.message, { id: toastId });
        }
      },
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        {data?.map((item) => (
          <Card key={item.id} className="border rounded-2xl">
            <CardHeader className="flex flex-row gap-4 border-b">
              <div className="flex-1 space-y-1">
                <CardTitle className="text-lg font-semibold">
                  {item.name}
                </CardTitle>
                {!item.teamId && (
                  <Badge
                    variant="secondary"
                    className="h-6 border border-amber-200 bg-amber-100"
                  >
                    Suggested
                  </Badge>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    {item.itemCount} items
                  </span>

                  <span>•</span>
                  <span className="font-medium">
                    {formatUSD(total)} Estimated
                  </span>
                </div>
                <CardDescription className="max-w-prose">
                  {item.description}
                </CardDescription>
              </div>

              <CardAction className="gap-2 flex">
                {/* show edit and delete if owned */}
                {item.teamId ? (
                  <>
                    <Button variant="outline" size="icon-sm">
                      <SquarePen />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => hanldeDelete(item.id)}
                    >
                      <Trash2 />
                    </Button>
                  </>
                ) : (
                  <Badge className="h-6 border rounded-md border-amber-200 bg-amber-100">
                    Suggested
                  </Badge>
                )}
              </CardAction>
            </CardHeader>
            <CardContent>
              <ItemList id={item.id} />
            </CardContent>
          </Card>
        ))}
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

const ItemList = ({ id }: { id: number }) => {
  const [layout, setLayout] = React.useState<"list" | "grid">("grid");

  const { data, isPending, isError, error } = useOrderGuide(id);

  React.useEffect(() => {
    const savedLayout = localStorage.getItem("layout-state") as "list" | "grid";
    if (savedLayout) {
      setLayout(savedLayout);
    }
  }, []);

  const handleLayoutChange = (newLayout: string) => {
    const val = newLayout as "list" | "grid";
    setLayout(val);
    localStorage.setItem("layout-state", val);
  };

  if (isPending) return <LoadingSkeleton />;

  if (isError) return <EmptyComponent variant="error" title={error.message} />;

  if (!data)
    return <EmptyComponent variant="empty" title="No order guides found" />;
  if (data.data.items.length === 0)
    return <EmptyComponent variant="empty" title="No order guides found" />;

  const selected =
    data?.data?.items.map((item) => {
      return {
        ...item,
        price: item.finalPrice,
        categories: item.categories!,
        image: item.image!,
      };
    }) ?? [];

  return (
    <div className="group/card @container" data-layout={layout}>
      {/* header content here  */}
      <div className="flex gap-4 items-center mb-6">
        <ProductSelectorCustomer
          selected={selected}
          setSelectedChange={(value) => console.log(value)}
        >
          <Button
            variant="outline"
            size="lg"
            type="button"
            className="flex-1 justify-start text-muted-foreground"
          >
            <Search />
            Browse products...
            <ChevronsUpDown className="ml-auto" />
          </Button>
        </ProductSelectorCustomer>
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
                size="lg"
              >
                <Icon />
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      {/* cards wrapper */}
      <Sortable
        value={data.data.items}
        onValueChange={(v) => {
          const reordered = v.map((i) => ({
            ...i,
            productId: Number(i.productId),
          }));
        }}
        getItemValue={(item) => String(item.productId)}
        strategy={layout === "grid" ? "grid" : "vertical"}
        className={`flex-1 text-base overflow-auto no-scrollbar px-0 grid ${LAYOUTS.find((l) => l.value === layout)?.className}`}
      >
        {data.data.items.map((item) => (
          <GuideItemCard key={item.id} item={item} />
        ))}
      </Sortable>
    </div>
  );
};

const GuideItemCard = ({ item }: { item: OrderGuideItem }) => {
  const confirm = useConfirm();

  // handle remove item from order guide
  const handleRemove = () => {
    confirm.delete({
      title: "Remove item",
      description: "Are you sure you want to remove this item from the guide?",
      actionLabel: "Remove",

      action: async () => {},
    });
  };

  return (
    <SortableItem
      value={String(item.productId)}
      className={cn(
        `flex data-[dragging=true]:opacity-100! overflow-hidden animate-in relative cursor-pointer items-center bg-background gap-4 rounded-xl border p-3 transition fade-in-50 select-none slide-in-from-bottom-10 group-data-[layout=grid]/card:h-full group-data-[layout=grid]/card:flex-col
          group-data-[layout=grid]/card:items-stretch group-data-[layout=grid]/card:gap-0 group-data-[layout=grid]/card:p-0`,
      )}
    >
      <SortableItemHandle className="group-data-[layout=grid]/card:absolute group-data-[layout=grid]/card:top-3 group-data-[layout=grid]/card:left-3 z-1">
        <GripVerticalIcon className="size-4" />
      </SortableItemHandle>
      <div className="relative aspect-square inline-flex items-center justify-center w-12 shrink-0 overflow-hidden rounded-t-lg group-data-[layout=list]/card:rounded-lg bg-secondary group-data-[layout=grid]/card:aspect-video group-data-[layout=grid]/card:w-full">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            width={200}
            height={200}
            className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
          />
        ) : (
          <ImageOff className="opacity-40 size-4 group-data-[layout=grid]/card:size-6" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-start gap-4 group-data-[layout=grid]/card:w-full group-data-[layout=grid]/card:flex-col group-data-[layout=grid]/card:justify-between group-data-[layout=grid]/card:p-3">
        <div className="w-full min-w-0 flex flex-col gap-1">
          <h4 className="leading-tight text-sm font-medium group-data-[layout=grid]/card:order-2">
            {item.title}
          </h4>

          <div className="flex w-full items-center gap-2">
            <div className="no-scrollbar flex min-w-0 flex-nowrap items-center gap-1 overflow-auto">
              {item.categories?.map((cat, i) => (
                <span
                  key={cat + i}
                  className="inline-block text-xs leading-[1.1] font-medium whitespace-nowrap text-muted-foreground uppercase not-last:border-r-2 not-last:pr-1"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="ml-auto w-24 self-center text-xs text-muted-foreground group-data-[layout=grid]/card:hidden">
          {item.pack ?? null}
        </div>

        <div className="w-24 self-center font-bold text-primary text-right group-data-[layout=grid]/card:hidden">
          {formatUSD(item.finalPrice ?? 0)}
        </div>
        {/* remove action */}
        <Button
          size="icon-xs"
          variant="destructive"
          className="group-data-[layout=grid]/card:absolute group-data-[layout=grid]/card:top-2 group-data-[layout=grid]/card:right-2 group-data-[layout=grid]/card:z-1 self-center"
          onClick={handleRemove}
        >
          <Trash2 />
        </Button>

        <div className="flex w-full items-center gap-2 group-data-[layout=list]/card:hidden">
          <div className="flex flex-1 flex-col">
            <div className="text-xs text-muted-foreground">
              {item.pack ?? null}
            </div>
            <div className="font-bold text-primary w-auto self-start">
              {formatUSD(item.finalPrice ?? 0)}
            </div>
          </div>
        </div>
      </div>
    </SortableItem>
  );
};
