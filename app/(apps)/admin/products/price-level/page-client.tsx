"use client";

import React from "react";
import Link from "next/link";
import { PriceLevelType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { usePriceLevel } from "@/hooks/use-product";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { DataTable } from "@/components/admin/data-table";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { MoreVertical, SquarePen, Trash } from "lucide-react";
import { PriceLevelDialog } from "@/components/admin/price-level-dialog";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();

  const { data, error, isPending, isError } = usePriceLevel(
    searchParams.toString()
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
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <Link href={`/admin/products/price-level/${row.original.id}`}>
        {row.original.id}
      </Link>
    ),
  },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      <Badge variant="secondary" className="h-6 text-sm uppercase">
        {row.original.type}
      </Badge>;
    },
  },
  { accessorKey: "value", header: "Value" },
  { accessorKey: "scope", header: "Scope" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const map = STATUS_MAP[row.original.status as keyof typeof STATUS_MAP];
      return (
        <Badge
          variant="outline"
          style={{ "--color": map.color } as React.CSSProperties}
          className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
        >
          <map.icon className="text-(--color)" />
          {map.label}
        </Badge>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      return (
        <PopoverXDrawer
          open={open}
          setOpen={setOpen}
          trigger={
            <Button
              size="icon-sm"
              variant="outline"
              className="rounded-xl absolute right-2 top-2 z-2"
            >
              <MoreVertical className="size-5" />
            </Button>
          }
        >
          <PriceLevelDialog>
            <Button variant="ghost">
              <SquarePen /> Edit
            </Button>
          </PriceLevelDialog>
          <Button variant="destructive">
            <Trash /> Delete
          </Button>
        </PopoverXDrawer>
      );
    },
  },
];
