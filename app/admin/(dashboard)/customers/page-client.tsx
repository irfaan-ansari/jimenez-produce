"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useCustomers } from "@/hooks/use-customer";
import { statusMap } from "@/lib/constants/customer";
import { CustomerSelectType } from "@/lib/db/schema";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { DataTable } from "@/components/admin/data-table";

import { CustomerAction } from "@/components/admin/customer-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import Link from "next/link";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();

  const { data, error, isPending, isError } = useCustomers(
    searchParams.toString()
  );

  // loading
  if (isPending) return <LoadingSkeleton />;

  // error
  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  // data
  return (
    <DataTable
      columns={columns}
      data={data.data}
      pagination={{ ...data.pagination }}
    />
  );
};

export const columns: ColumnDef<CustomerSelectType>[] = [
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => {
      const {
        thumbnail,
        companyName,
        companyStreet,
        companyState,
        companyZip,
        id,
      } = row.original;
      return (
        <Link
          href={`/admin/customers/${id}`}
          className="flex gap-4 hover:underline transition"
        >
          <div className="shrink-0 pt-1.5">
            <Avatar className="shrink-0 size-8 ring-2 ring-ring/30 rounded-xl **:rounded-xl relative">
              <AvatarImage src={thumbnail!} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-1 max-w-3xs w-full">
            <h4 className="font-medium text-base">{companyName}</h4>
            <div className="flex flex-col text-muted-foreground">
              <span className="text-sm line-clamp-1">{companyStreet}</span>
              <span className="text-sm">
                {companyState} - {companyZip}
              </span>
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "officerFirst",
    header: "Primary Contact",
    cell: ({ row }) => {
      const { officerFirst, officerLast, officerMobile, officerEmail } =
        row.original;
      return (
        <div className="space-y-1">
          <h4 className="font-medium text-[15px]">
            {officerFirst} {officerLast}
          </h4>
          <div className="flex flex-col text-muted-foreground">
            <span className="text-sm">{officerMobile}</span>
            <span className="text-sm">{officerEmail}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "deliverySchedule",
    header: "Delivery",
    cell: ({ row }) => {
      const { deliverySchedule } = row.original;
      return (
        <div className="flex gap-2 items-start">
          <div className="space-y-1">
            <h4 className="font-medium text-[15px]">
              {deliverySchedule[0].day}
            </h4>
            <div className="flex flex-col text-muted-foreground">
              <span className="text-sm">{deliverySchedule[0].window}</span>
              <span className="text-sm">
                {deliverySchedule[0].receivingName}
              </span>
            </div>
          </div>

          {deliverySchedule.length > 1 && (
            <Badge className="size-7 rounded-full" variant="secondary">
              +{deliverySchedule.length - 1}
            </Badge>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const map = statusMap[row.original.status as keyof typeof statusMap];

      return (
        <Badge
          variant="outline"
          style={{ "--color": map.color } as React.CSSProperties}
          className="h-7 rounded-xl pl-1.5 pr-2.5 gap-1.5 [&>svg]:size-3.5! bg-(--color)/10 border-(--color)/10 text-sm"
        >
          <map.icon className="text-(--color)" />

          {map.label}
        </Badge>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <CustomerAction
          status={row.original.status as keyof typeof statusMap}
          id={row.original.id}
        />
      );
    },
  },
];
