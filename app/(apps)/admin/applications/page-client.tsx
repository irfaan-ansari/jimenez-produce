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
import { CopyButton } from "@/components/copy-button";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();

  const { data, error, isPending, isError } = useCustomers(
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

export const columns: ColumnDef<CustomerSelectType>[] = [
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => {
      const {
        thumbnail,
        companyName,

        companyPhone,
        companyEmail,
        id,
      } = row.original;
      return (
        <Link
          href={`/admin/customers/${id}`}
          className="flex items-start gap-2"
        >
          <div className="shrink-0 pt-0.5">
            <Avatar className="relative size-8 shrink-0 rounded-lg ring-2 ring-ring/30 **:rounded-lg">
              <AvatarImage src={thumbnail!} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <h4 className="font-medium">{companyName}</h4>
            <div className="-space-y-1">
              <CopyButton value={companyPhone} />
              <CopyButton value={companyEmail} />
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "officerFirst",
    header: "Manager",
    cell: ({ row }) => {
      const { officerFirst, officerLast, officerMobile, officerEmail } =
        row.original;
      return (
        <div className="space-y-1">
          <h4 className="font-medium">
            {officerFirst} {officerLast}
          </h4>
          <div className="-space-y-1">
            <CopyButton value={officerMobile} />
            <CopyButton value={officerEmail} />
          </div>
        </div>
      );
    },
  },
  {
    id: "address",
    header: "Address",
    cell: ({ row }) => {
      const { companyStreet, companyState, companyZip, companyCity } =
        row.original;
      return (
        <div className="space-y-1">
          <h4 className="font-medium">{companyStreet}</h4>
          <div className="flex flex-col text-muted-foreground">
            <span className="text-sm">{companyCity},</span>
            <span className="text-sm">
              {companyState} {companyZip}
            </span>
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
              <h4 className="font-medium">{deliverySchedule?.[0]?.day}</h4>
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
    header: "Applied",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
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
