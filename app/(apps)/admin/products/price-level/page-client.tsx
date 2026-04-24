"use client";

import React from "react";

import { toast } from "sonner";
import { formatUSD } from "@/lib/utils";
import { format } from "date-fns/format";
import { PriceLevelType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { usePriceLevels } from "@/hooks/use-product";
import { DataTable } from "@/components/admin/data-table";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { MoreVertical, SquarePen, Trash } from "lucide-react";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { PriceLevelDialog } from "@/app/(apps)/admin/products/price-level/price-level-dialog";
import { useConfirm } from "@/hooks/use-confirm";
import { deletePriceLevel } from "@/server/price-level";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();

  const { data, error, isPending, isError } = usePriceLevels(
    searchParams.toString(),
  );

  // data
  return (
    <DataTable
      columns={columns}
      data={data}
      isPending={isPending}
      isError={isError}
      error={error}
    />
  );
};

export const columns: ColumnDef<PriceLevelType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm leading-none">
            {row.original.name}
          </span>
          <Badge variant="secondary" className="h-5 px-2 text-xs capitalize">
            {row.original.status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Applies To",
    cell: ({ row }) => {
      const { appliesTo, adjustmentValue, adjustmentType, priceLevelItem } =
        row.original;

      const isAll = appliesTo === "all";
      const count = priceLevelItem?.length ?? 0;

      if (!isAll) {
        return (
          <span className="text-sm text-muted-foreground">
            {count} product{count !== 1 ? "s" : ""}
          </span>
        );
      }

      // --- all case ---
      const isPercent = adjustmentType === "percentage";
      const isNegative = Number(adjustmentValue ?? 0) < 0;

      const sign = isNegative ? "-" : "+";
      const formattedValue = isPercent
        ? `${Math.abs(Number(adjustmentValue ?? 0))}%`
        : formatUSD(Math.abs(Number(adjustmentValue ?? 0)));

      const colorClass = isNegative
        ? "bg-red-100 text-red-700"
        : isPercent
          ? "bg-blue-100 text-blue-700"
          : "bg-emerald-100 text-emerald-700";

      return (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-md text-xs font-medium ${colorClass}`}
          >
            {sign}
            {formattedValue}
          </span>

          <span className="text-sm text-muted-foreground">All items</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    meta: {
      className: "w-28",
    },
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.original.createdAt!), "MMM dd • hh:mm a")}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    meta: {
      className: "w-10",
    },
    header: "",
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      const confirm = useConfirm();

      const handleDelete = () => {
        confirm.delete({
          title: "Delete Price Level",
          description: "Are you sure you want to delete this price level?",
          action: async () => {
            const toastId = toast.loading("Please wait...");
            const { error } = await deletePriceLevel(row.original.id);

            if (error) {
              toast.error(error.message, { id: toastId });
            } else {
              toast.success("Price level deleted successfully", {
                id: toastId,
              });
              setOpen(false);
            }
          },
        });
      };
      return (
        <PopoverXDrawer
          open={open}
          setOpen={setOpen}
          trigger={
            <Button size="icon-sm" variant="outline" className="rounded-lg">
              <MoreVertical className="size-5" />
            </Button>
          }
        >
          <PriceLevelDialog data={row.original as any}>
            <Button variant="ghost" className="justify-start w-full rounded-lg">
              <SquarePen /> Edit
            </Button>
          </PriceLevelDialog>
          <Button
            variant="destructive"
            className="rounded-lg!"
            onClick={handleDelete}
          >
            <Trash /> Delete
          </Button>
        </PopoverXDrawer>
      );
    },
  },
];
