import React from "react";
import { toast } from "sonner";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanOverlay,
} from "@/components/ui/kanban";
import {
  createOrderGuide,
  deleteOrderGuide,
  updateOrderGuides,
} from "@/server/order-guide";
import { ProductsState } from "./item-list";
import { ProductGrid } from "./product-grid";
import { Badge } from "@/components/ui/badge";
import { formOpt } from "./order-form-options";
import { Tooltip } from "@/components/tooltip";
import { withForm } from "@/hooks/form-context";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  GripVertical,
  Loader,
  PenSquare,
  Plus,
  Trash2,
} from "lucide-react";
import { Columns, useOrderGuideStore } from "@/lib/store/order-guide-store";
import { useInfiniteOrderGuides } from "@/hooks/use-orders";
import { useOrderUIStore } from "@/lib/store/order-store";

export const GuideList = withForm({
  ...formOpt,
  render: function Render({ form }) {
    const queryClient = useQueryClient();
    const { data, isPending, isError, error } = useInfiniteOrderGuides("");

    const columns = useOrderGuideStore((s) => s.columns);
    const columnMeta = useOrderGuideStore((s) => s.columnMeta);
    const setColumns = useOrderGuideStore((s) => s.setColumns);

    React.useEffect(() => {
      const flatData = data?.pages?.flatMap((page) => page.data) ?? [];

      const columns = Object.fromEntries(
        flatData.map((item) => {
          const { items } = item;
          return [
            `${item.id}-${item.name}`,
            items.map((i) => ({
              productId: i.productId,
              title: i.title,
              price: i.finalPrice,
              total: i.finalPrice,
              quantity: i.quantity!,
              image: i.image!,
              identifier: i.identifier,
              categories: i.categories!,
              isTaxable: i.isTaxable!,
              lastPurchased: null,
            })),
          ];
        }),
      );

      const meta = Object.fromEntries(
        flatData.map((item) => {
          return [
            `${item.id}-${item.name}`,
            {
              id: item.id,
              name: item.name,
              description: item.description!,
              position: item.position,
            },
          ];
        }),
      );

      setColumns({ columns, columnMeta: meta });
    }, [data]);

    /**
     * Handles the reordering of columns (order guides)
     */
    const handleReorder = async (value: Columns) => {
      const cols = Object.entries(value).map(([key, items]) => {
        return {
          id: key,
          items: items,
          meta: columnMeta[key],
        };
      });
      setColumns(cols);

      const guides = Object.entries(value).map(([key, items]) => {
        const [guideId] = key.split("-");

        return {
          id: Number(guideId),
          productIds: items.map((item) => Number(item.productId)),
        };
      });

      // const { success, error } = await updateOrderGuides(guides);
      // if (success) {
      //   queryClient.invalidateQueries({
      //     queryKey: ["customer-order-guides"],
      //   });
      // } else {
      //   toast.error(error?.message);
      // }
    };

    return (
      <Kanban
        value={columns}
        getItemValue={(item) => String(item.dndId ?? item?.productId)}
        onValueChange={handleReorder}
        orientation="vertical"
      >
        <KanbanBoard>
          {Object.entries(columns).map(([colKey, items]) => (
            <KanbanColumn
              key={colKey}
              value={colKey}
              className="rounded-xl border bg-background shadow-sm"
            >
              <ColumnHeader value={colKey} />
              <ProductGrid items={items} form={form} draggable={true} />
            </KanbanColumn>
          ))}
        </KanbanBoard>
        <KanbanOverlay className="rounded-xl border-2 border-dashed bg-muted/10 " />
      </Kanban>
    );
  },
});

// column with drag handle and header actions
const ColumnHeader = ({ value }: { value: string }) => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [disabled, setDisabled] = React.useState(false);
  const [cloning, setCloning] = React.useState(false);
  const meta = useOrderGuideStore((s) => s.columnMeta[value]);
  const columnItems = useOrderGuideStore((s) => s.columns[value]);

  const setSelectedTab = useOrderUIStore((s) => s.setSelectedTab);

  const setSelectionState = useOrderUIStore((s) => s.setSelectionState);

  const handleAddItem = () => {
    setSelectedTab("all");

    const items = Object.fromEntries(
      columnItems.map((item) => [
        String(item.productId),
        {
          productId: item.productId,
          title: item.title,
          image: item.image,
          categories: item.categories,
          price: item.price,
        },
      ]),
    );

    setSelectionState({
      mode: "update",
      items: items,
      guideId: Number(value.split("-")[0]),
      name: meta.name ?? "",
      description: meta.description ?? "",
    });
  };

  const duplicate = async () => {
    setCloning(true);
    setDisabled(true);
    const guideData = {
      name: `${meta.name} copy`,
      description: meta.description,
    };
    const { success, error } = await createOrderGuide({
      ...guideData,
      productIds: columnItems.map((c) => c.productId),
    });
    if (success) {
      queryClient.invalidateQueries({
        queryKey: ["customer-order-guides"],
      });
    }
    setCloning(false);
    setDisabled(false);
  };

  const hanldeDelete = async () => {
    const [id] = value.split("-");
    confirm.delete({
      title: "Delete order guide",
      description: "Are you sure you want to delete this order guide?",
      action: async () => {
        const { success, error } = await deleteOrderGuide(Number(id));
        if (success) {
          toast.success("Order guide deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["customer-order-guides"],
          });
        } else {
          toast.error(error?.message);
        }
      },
    });
  };

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-secondary px-2 py-2">
      <KanbanColumnHandle asChild>
        <Button variant="ghost" size="icon-sm" className="opacity-100">
          <GripVertical className="h-4 w-4" />
        </Button>
      </KanbanColumnHandle>

      <div className="flex flex-1 items-center gap-2">
        <span className="font-medium">{meta?.name}</span>
        <Badge variant="warning" className="pointer-events-none rounded-sm">
          {meta?.itemCount}
        </Badge>
      </div>
      <div className="flex items-center gap-1 self-center [&>svg]:size-4">
        <Tooltip content="Add / Remove item(s)">
          <Button
            size="icon-sm"
            variant="ghost"
            disabled={disabled}
            onClick={handleAddItem}
          >
            <PenSquare />
          </Button>
        </Tooltip>
        <Tooltip content="Duplicate">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={duplicate}
            disabled={disabled}
          >
            {cloning ? <Loader className="animate-spin" /> : <Copy />}
          </Button>
        </Tooltip>
        <Tooltip content="Delete">
          <Button
            size="icon-sm"
            variant="ghost"
            className="text-destructive"
            onClick={hanldeDelete}
            disabled={disabled}
          >
            <Trash2 />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
