"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useCustomers } from "@/hooks/use-customer";
import { CustomerSelectType } from "@/lib/db/schema";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { DataTable } from "@/components/admin/data-table";
import { CustomerAction } from "@/components/admin/customer-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { STATUS_MAP } from "@/lib/constants/status-map";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();

  const { data, error, isPending, isError } = useCustomers(
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
          className="flex gap-4 transition hover:underline"
        >
          <div className="shrink-0 pt-1.5">
            <Avatar className="relative size-8 shrink-0 rounded-xl ring-2 ring-ring/30 **:rounded-xl">
              <AvatarImage src={thumbnail!} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </div>
          <div className="w-full max-w-3xs space-y-1 overflow-hidden">
            <h4 className="text-base font-medium ">{companyName}</h4>
            <div className="flex flex-col text-muted-foreground">
              <span className="line-clamp-1 text-sm">{companyStreet}</span>
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
          <h4 className="text-[15px] font-medium">
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
        <div className="flex items-start gap-2">
          {deliverySchedule.length > 0 ? (
            <div className="space-y-1">
              <h4 className="text-[15px] font-medium">
                {deliverySchedule?.[0]?.day}
              </h4>
              <div className="flex flex-col text-muted-foreground">
                <span className="text-sm">{deliverySchedule?.[0]?.window}</span>
                <span className="text-sm">
                  {deliverySchedule?.[0]?.receivingName}
                </span>
              </div>
            </div>
          ) : (
            "Not specified"
          )}
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
    accessorKey: "createdAt",
    header: "Date Applied",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {format(row.original.createdAt!, "MMMM dd, yyyy")}
          </span>
          <span className="text-muted-foreground">
            {format(row.original.createdAt!, "hh:mm:ss a")}
          </span>
        </div>
      );
    },
  },
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
    header: "Action",
    cell: ({ row }) => {
      return <CustomerAction data={row.original} />;
    },
  },
];
