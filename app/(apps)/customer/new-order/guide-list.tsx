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
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useQueryClient } from "@tanstack/react-query";
import { Copy, GripVertical, Loader, Plus, Trash2 } from "lucide-react";
import { Columns, useOrderGuideStore } from "@/lib/store/order-guide-store";
import { useInfiniteOrderGuides, useOrderGuide } from "@/hooks/use-orders";
import { useOrderUIStore } from "@/lib/store/order-store";

export const GuideList = withForm({
  ...formOpt,
  render: function Render({ form }) {
    const queryClient = useQueryClient();
    const { data, isPending, isError, error } = useInfiniteOrderGuides("");
    const columns = useOrderGuideStore((s) => s.columns);
    const setColumns = useOrderGuideStore((s) => s.setColumns);
    const setColumnMeta = useOrderGuideStore((s) => s.setColumnMeta);

    const mappedData = React.useMemo(() => {
      const flatData = data?.pages?.flatMap((page) => page.data) ?? [];
      const cols = Object.fromEntries(
        flatData.map((item) => {
          const stringId = `${item.id}-${item.name}`;
          return [stringId, []];
        }),
      );

      const colMeta = Object.fromEntries(
        flatData.map((item) => {
          const stringId = `${item.id}-${item.name}`;
          return [
            stringId,
            {
              id: item.id,
              name: item.name,
              description: item.description,
              position: item.position,
              itemCount: item.itemCount,
            },
          ];
        }),
      );
      return { cols, colMeta };
    }, [data]);

    React.useEffect(() => {
      if (!mappedData.cols) return;
      const { cols, colMeta } = mappedData;

      setColumns({ ...cols, ...columns });
      setColumnMeta(colMeta);
    }, [mappedData]);

    /**
     * Handles the reordering of columns (order guides)
     */
    const handleReorder = async (value: Columns) => {
      setColumns(value);

      const guides = Object.entries(value).map(([key, items]) => {
        const [guideId] = key.split("-");

        return {
          id: Number(guideId),
          productIds: items.map((item) => Number(item.productId)),
        };
      });

      const { success, error } = await updateOrderGuides(guides);
      if (success) {
        queryClient.invalidateQueries({
          queryKey: ["customer-order-guides"],
        });
      } else {
        toast.error(error?.message);
      }
    };

    return (
      <Kanban
        value={columns}
        getItemValue={(item) => String(item.dndId ?? item?.productId)}
        onValueChange={handleReorder}
        orientation="vertical"
      >
        <KanbanBoard>
          <ProductsState
            isError={isError}
            isPending={isPending}
            error={error}
            hasProducts={Object.keys(columns).length > 0}
          />
          {Object.entries(columns).map(([colKey]) => (
            <KanbanColumn
              key={colKey}
              value={colKey}
              className="rounded-xl border bg-background shadow-sm"
            >
              <ColumnHeader value={colKey} />
              <GuideItems form={form} guideId={colKey} />
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
  const column = useOrderGuideStore((s) => s.columns[value]);

  // add item
  const setIsSelecting = useOrderUIStore((s) => s.setIsSelecting);
  const setSelectedTab = useOrderUIStore((s) => s.setSelectedTab);
  const setSelectedItems = useOrderUIStore((s) => s.setSelectedItems);
  const setSelectedGuide = useOrderUIStore((s) => s.setSelectedGuide);

  const handleAddItem = () => {
    setSelectedTab("all");
    setIsSelecting(true);
    setSelectedGuide(Number(value.split("-")[0]));

    const items = new Map<number, any>();
    column.forEach((c) => {
      items.set(c.productId, {
        productId: c.productId,
        title: c.title,
        image: c.image,
        categories: c.categories,
        price: c.price,
      });
    });

    setSelectedItems(items);
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
      productIds: column.map((c) => c.productId),
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
        <Tooltip content="Add item">
          <Button
            size="icon-sm"
            variant="ghost"
            disabled={disabled}
            onClick={handleAddItem}
          >
            <Plus />
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

export const GuideItems = withForm({
  ...formOpt,
  props: {} as {
    guideId: string;
  },
  render: function Render({ form, guideId }) {
    const [id] = guideId.split("-");
    const items = useOrderGuideStore((s) => s.columns[guideId]);
    const setColumnItems = useOrderGuideStore((s) => s.setColumnItems);

    const { data, isPending, isError, error } = useOrderGuide(id);

    const mappedProduct = React.useMemo(() => {
      return (
        data?.data?.items.map((item) => ({
          dndId: item.id,
          productId: item.productId,
          title: item.title,
          image: item.image,
          identifier: item.identifier,
          categories: item.categories ?? [],
          price: item.finalPrice,
          total: item.finalPrice,
          quantity: "0",
          isTaxable: item.isTaxable ?? false,
          lastPurchased: null,
        })) ?? []
      );
    }, [data]);

    React.useEffect(() => {
      setColumnItems(guideId, mappedProduct);
    }, [mappedProduct]);

    if (isPending) return <LoadingSkeleton className="py-10" />;
    if (isError) {
      return (
        <EmptyComponent variant="error" title={error?.message} description="" />
      );
    }
    return <ProductGrid items={items} form={form} draggable={true} />;
  },
});
