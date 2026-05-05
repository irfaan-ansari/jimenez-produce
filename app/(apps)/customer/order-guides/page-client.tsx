"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { OrderGuideDialog } from "./order-guide-dialog";
import { DataTable } from "@/components/admin/data-table";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { Eye, MoreVertical, SquarePen, Trash2 } from "lucide-react";

export const GUIDES = [
  {
    id: 1,
    name: "Weekly Essentials",
    description: "Frequently ordered items for weekly restock",
    itemsCount: 12,
    recommended: true,
  },
  {
    id: 2,
    name: "Office Supplies",
    description: "Stationery and office basics for daily operations",
    itemsCount: 8,
    recommended: false,
  },
  {
    id: 3,
    name: "Kitchen Stock",
    description: "All kitchen and pantry essentials",
    itemsCount: 15,
    recommended: true,
  },
  {
    id: 4,
    name: "Electronics Backup",
    description: "Spare devices and essential accessories",
    itemsCount: 6,
    recommended: false,
  },
  {
    id: 5,
    name: "Cleaning Supplies",
    description: "Sanitizers, detergents, and cleaning essentials",
    itemsCount: 10,
    recommended: true,
  },
];

export const OrderGuidesClientPage = () => {
  return (
    <DataTable
      columns={columns}
      data={{
        data: GUIDES,
        pagination: { page: 1, limit: 10, totalPages: 1, total: 5 },
      }}
      isPending={false}
      isError={false}
      error={null}
    />
  );
};

export const columns: ColumnDef<(typeof GUIDES)[number]>[] = [
  {
    accessorKey: "id",
    header: "Order",
    cell: ({ row }) => {
      return (
        <Link
          href={`/customer/orders-guides/${row.original.id}`}
          className="flex flex-col gap-1.5"
        >
          <div className="flex items-center gap-2 font-medium">
            {row.original.name}
            {row.original.recommended && (
              <Badge
                variant="outline"
                className="h-7 gap-1.5 rounded-xl bg-amber-100 border-amber-200 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
              >
                Suggested
              </Badge>
            )}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Tap to view details
          </span>
        </Link>
      );
    },
  },
  {
    id: "createdAt",
    header: "Visibility",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {row.original.recommended ? "Private" : "Shared"}
        </span>
      );
    },
  },

  {
    id: "deliveryDate",
    header: "Items",
    cell: ({ row }) => {
      return <span>{row.original.itemsCount}</span>;
    },
  },

  {
    id: "action",
    meta: {
      className: "text-right w-10",
    },
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      const { id } = row.original;
      return (
        <PopoverXDrawer
          open={open}
          setOpen={setOpen}
          trigger={
            <Button size="icon" variant="outline" className="rounded-lg">
              <MoreVertical className="size-5" />
            </Button>
          }
        >
          <Button type="button" variant="ghost" asChild>
            <Link href={`/customer/orders-guides/${id}`}>
              <Eye />
              View
            </Link>
          </Button>
          <Button type="button" variant="ghost" asChild>
            <OrderGuideDialog>
              <Button variant="ghost" className="justify-start rounded-xl">
                <SquarePen />
                Edit
              </Button>
            </OrderGuideDialog>
          </Button>

          <Button variant="destructive">
            <Trash2 /> Delete
          </Button>
        </PopoverXDrawer>
      );
    },
  },
];
