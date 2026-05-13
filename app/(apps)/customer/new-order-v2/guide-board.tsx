import React from "react";
import { Copy, GripVertical, Plus, SquarePen, Trash2, X } from "lucide-react";
import { formatUSD } from "@/lib/utils";
import { ProductGrid } from "./product-grid";
import { Badge } from "@/components/ui/badge";
import { formOpt, OrderItem } from "./order-form-options";
import { Button } from "@/components/ui/button";
import { withForm } from "@/hooks/form-context";
import { useInfiniteOrderGuides, useOrderGuide } from "@/hooks/use-orders";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { updateOrderGuide } from "@/server/order-guide";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanOverlay,
} from "@/components/reui/kanban";

export const GuideBoard = withForm({
  ...formOpt,
  props: {},
  render: function Render({ form }) {
    const { data, isPending, isError, error } = useInfiniteOrderGuides("");

    if (isError) return null;
    if (isPending) return null;

    const flatData = data?.pages?.flatMap((page) => page.data) ?? [];

    const initialColumns: Record<string, unknown[]> = flatData.reduce(
      (acc, guide) => {
        acc[guide.id] = [];

        return acc;
      },
      {} as Record<string, unknown[]>,
    );

    return (
      <Kanban
        value={initialColumns}
        getItemValue={(item) => item?.id}
        onValueChange={(v) => console.log(v)}
      >
        <KanbanBoard className="grid grid-cols-2 gap-6">
          {Object.entries(initialColumns).map(([columnValue, tasks]) => (
            <KanbanColumn key={columnValue} value={columnValue}>
              <div className="p-3 bg-secondary rounded-xl font-medium text-base flex gap-2 items-center [&>svg]:size-4">
                <KanbanColumnHandle>
                  <GripVertical className="size-4 text-muted-foreground" />
                </KanbanColumnHandle>
                COlumn Name
                <span className="flex-1">
                  <Badge>10</Badge>
                </span>
                <div className="flex gap-3 items-center self-center [&>svg]:size-4">
                  <SquarePen />
                  <Copy />
                  <Trash2 />
                  <Plus />
                </div>
              </div>
              <KanbanColumnContent value={columnValue} className="@container">
                <KanbanItem value={columnValue} className="">
                  <GuideItems form={form} guideId={columnValue} />
                </KanbanItem>
              </KanbanColumnContent>
            </KanbanColumn>
          ))}
        </KanbanBoard>
        <KanbanOverlay className="bg-muted/10 rounded-md border-2 border-dashed" />
      </Kanban>
    );
  },
});
export const GuideItems = withForm({
  ...formOpt,
  props: { layout: { className: "" } } as Record<string, any>,
  render: function Render({ form, layout, guideId }) {
    const [items, setItems] = React.useState<OrderItem[]>([]);
    const queryClient = useQueryClient();

    const { data, isEnabled, isPending } = useOrderGuide(guideId);

    const mappedProduct = React.useMemo(() => {
      return (
        data?.data?.items?.map((product) => {
          return {
            productId: product.productId,
            title: product.title,
            image: product.image,
            type: product.type,
            identifier: product.identifier,
            pack: product.pack,
            categories: product.categories ?? [],
            price: product.finalPrice,
            total: product.finalPrice,
            quantity: "0",
            isTaxable: product.isTaxable ?? false,
            lastPurchased: null,
            isGuide: !!data?.data?.teamId,
            isSuggested: !data?.data?.teamId,
          };
        }) ?? []
      );
    }, [data]);

    React.useEffect(() => {
      if (mappedProduct.length === 0) return;

      setItems(mappedProduct);
    }, [mappedProduct]);

    // update order in db
    const handleMove = React.useCallback(
      async (nextItems: OrderItem[]) => {
        setItems(nextItems);
        if (!data || !data?.data) return;
        const { name = "", description = "" } = data?.data || {};

        const { success } = await updateOrderGuide(Number(guideId), {
          name,
          description,
          productIds: nextItems.map((item) => Number(item.productId)),
        });

        if (!success) {
          toast.error("Failed to update order guide");
        } else {
          queryClient.invalidateQueries({ queryKey: ["order-guide", guideId] });
        }
      },
      [guideId],
    );

    if (!isEnabled) return null;

    // draggable and can be moved to other section in parent
    return (
      <ProductGrid
        items={items}
        form={form}
        layout="grid"
        sortable={!!data?.data?.teamId}
        onMoveComplete={(newItems) => handleMove(newItems)}
      />
    );
  },
});
