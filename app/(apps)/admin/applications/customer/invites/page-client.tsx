"use client";

import Link from "next/link";
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useInvites } from "@/hooks/use-customer";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { DataTable } from "@/components/admin/data-table";
import { CustomerInviteSelectType } from "@/lib/db/schema";
import { inviteStatusMap } from "@/lib/constants/customer";
import { CustomerInviteAction } from "@/components/admin/customer-invite-actions";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const PageClient = () => {
  const { getQueryString } = useRouterStuff();

  const { data, isPending, isError, error } = useInvites(
    getQueryString({ type: "invitation" })
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isError={isError}
      isPending={isPending}
      error={error}
    />
  );
};

export const columns: ColumnDef<CustomerInviteSelectType>[] = [
  {
    id: "fullName",
    header: "Name",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return (
        <span className="font-medium">
          {firstName} {lastName}
        </span>
      );
    },
  },
  {
    id: "contact",
    header: "Contact Details",
    cell: ({ row }) => {
      const { phone, email } = row.original;
      return (
        <div className="flex flex-col text-muted-foreground">
          <span className="text-sm">{phone}</span>
          <span className="text-sm">{email}</span>
        </div>
      );
    },
  },
  {
    id: "company",
    header: "Company",
    accessorFn: (row) => row.companyName ?? "",
    cell: ({ row }) => {
      const { companyName, companyType } = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{companyName}</span>
          {companyType && (
            <span className="text-sm text-muted-foreground">{companyType}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Invited",
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
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            variant="link"
            className="w-[10ch] min-w-0 truncate text-foreground justify-start px-0"
          >
            <span className="block truncate">{row.original.message}</span>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="whitespace-pre-line max-h-60 no-scrollbar overflow-auto bg-background w-xs rounded-2xl">
          {row.original.message}
        </HoverCardContent>
      </HoverCard>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status, customerId } = row.original;

      const map = inviteStatusMap[status as keyof typeof inviteStatusMap];

      return (
        <Link
          href={`/admin/customers/${customerId}`}
          onClick={(e) => !customerId && e.preventDefault()}
          className={!customerId ? "cursor-default" : ""}
        >
          <Badge
            variant="outline"
            style={{ "--color": map.color } as React.CSSProperties}
            className="h-7 rounded-xl pl-1.5 pr-2.5 gap-1.5 [&>svg]:size-3.5! bg-(--color)/10 border-(--color)/10 text-sm"
          >
            <map.icon className="text-(--color)" />

            {map.label}
          </Badge>
        </Link>
      );
    },
  },

  {
    id: "actions",
    header: "Action",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <CustomerInviteAction
        status={row.original.status as keyof typeof inviteStatusMap}
        id={row.original.id}
      />
    ),
  },
];
