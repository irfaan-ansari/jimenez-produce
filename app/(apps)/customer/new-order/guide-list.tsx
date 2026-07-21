import React from "react";
import { toast } from "sonner";
import {
  createOrderGuide,
  deleteOrderGuide,
  updateOrderGuides,
} from "@/server/order-guide";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanOverlay,
} from "@/components/ui/kanban";
import {
  ColumnMeta,
  Columns,
  useOrderGuideStore,
} from "@/lib/store/order-guide-store";
import { ProductGrid } from "./product-grid";
import { Badge } from "@/components/ui/badge";
import { formOpt } from "./order-form-options";
import { Tooltip } from "@/components/tooltip";
import { withForm } from "@/hooks/form-context";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderUIStore } from "@/lib/store/order-store";
import { useInfiniteOrderGuides } from "@/hooks/use-orders";
import { QueryState } from "@/components/admin/query-state";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { LoadingSkeleton } from "@/components/admin/placeholder-component";
import { Copy, GripVertical, Loader, PenSquare, Trash2 } from "lucide-react";

export const GuideList = withForm({
  ...formOpt,
  render: function Render({ form }) {
    const filter = useOrderUIStore((s) => s.filter) as Record<string, string>;

    const {
      data,
      isPending,
      isError,
      error,
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage,
    } = useInfiniteOrderGuides();

    const columns = useOrderGuideStore((s) => s.columns);
    const columnMeta = useOrderGuideStore((s) => s.columnMeta);
    const setColumns = useOrderGuideStore((s) => s.setColumns);

    const loadMoreRef = useInfiniteScroll(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, true);

    const parsedColumns = React.useMemo(() => {
      const columns: Columns = {};
      const meta: Record<string, ColumnMeta> = {};

      const flatData = data?.pages?.flatMap((page) => page.data) ?? [];

      for (const guide of flatData) {
        const key = `${guide.id}-${guide.name}`;

        columns[key] = guide.items.map((i) => ({
          productId: i.id,
          title: i.title,
          image: i.image,
          identifier: i.identifier,
          categories: i.categories ?? [],
          price: i.finalPrice,
          pack: i.pack,
          unit: i.unit,
          packWeight: i.packWeight,
          total: i.finalPrice,
          quantity: "0",
          isTaxable: i.isTaxable ?? false,
        }));

        meta[key] = {
          id: guide.id,
          name: guide.name,
          description: guide.description ?? "",
          position: guide.position,
          itemCount: guide.items.length,
          isOwner: !!guide.teamId,
        };
      }

      return { columns, meta };
    }, [data]);

    React.useEffect(() => {
      setColumns({
        columns: parsedColumns.columns,
        columnMeta: parsedColumns.meta,
      });
    }, [parsedColumns, setColumns]);

    /** Handle reorder */
    const handleReorder = async (value: Columns) => {
      setColumns({ columns: value });

      const guides = Object.entries(value).map(([key, items]) => {
        const [guideId] = key.split("-");
        return {
          id: Number(guideId),
          productIds: items.map((item) => Number(item.productId)),
        };
      });

      const { success, error } = await updateOrderGuides(guides);
      if (!success) toast.error(error?.message);
    };

    return (
      <Kanban
        value={columns}
        getItemValue={(item) => String(item?.productId)}
        onValueChange={handleReorder}
        orientation="vertical"
      >
        <KanbanBoard>
          <QueryState
            isPending={isPending}
            isError={isError}
            error={error}
            isEmpty={Object.entries(columns).length === 0}
          >
            {Object.entries(columns).map(([colKey, items]) => {
              const meta = columnMeta[colKey];
              return (
                <KanbanColumn
                  key={colKey}
                  value={colKey}
                  className={`border shadow-sm dark:bg-background rounded-xl bg-background ${!meta.isOwner ? "border-2 border-yellow-500" : ""}`}
                >
                  <ColumnHeader value={colKey} />
                  <ProductGrid
                    items={items}
                    key={colKey}
                    form={form}
                    draggable={meta.isOwner}
                  />
                </KanbanColumn>
              );
            })}
          </QueryState>
          <div
            ref={loadMoreRef}
            className="flex justify-center w-full col-span-full min-h-10"
          >
            {isFetchingNextPage && <LoadingSkeleton />}
          </div>
        </KanbanBoard>
        <KanbanOverlay className="border-2 border-dashed rounded-xl bg-muted/10 " />
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

  const items = React.useMemo(() => {
    return Object.fromEntries(
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
  }, [columnItems]);

  /**
   * Handle add item
   */
  const handleAddItem = () => {
    setSelectedTab("all");

    setSelectionState({
      mode: "update",
      items: items,
      guideId: Number(value.split("-")[0]),
      name: meta.name ?? "",
      description: meta.description ?? "",
    });
  };

  /**
   * Handle duplicate
   */
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

  /**
   * Hanlde delete
   */
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
    <div className="flex items-center justify-between gap-2 px-2 py-2 rounded-lg bg-secondary">
      <KanbanColumnHandle asChild>
        <Button variant="ghost" size="icon-sm" className="opacity-100">
          <GripVertical className="w-4 h-4" />
        </Button>
      </KanbanColumnHandle>

      <div className="flex items-center flex-1 gap-2">
        <span className="font-medium">{meta?.name}</span>
        <Badge variant="info" className="rounded-sm pointer-events-none">
          {meta?.itemCount + " Items"}
        </Badge>
      </div>
      <div className="flex items-center gap-1 self-center [&>svg]:size-4">
        {!meta.isOwner && (
          <Badge variant="warning" className="rounded-sm pointer-events-none">
            Assigned
          </Badge>
        )}
        {meta.isOwner && (
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
        )}
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
        {meta.isOwner && (
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
        )}
      </div>
    </div>
  );
};
