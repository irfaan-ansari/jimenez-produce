"use client";

import React from "react";
import { format } from "date-fns";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useInvites } from "@/hooks/use-customer";
import { DataTable } from "@/components/admin/data-table";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { CustomerInviteSelectType } from "@/lib/db/schema";
import { inviteStatusMap } from "@/lib/constants/customer";
import { CustomerInviteAction } from "@/components/admin/customer-invite-actions";

export const PageClient = () => {
  const { getQueryString } = useRouterStuff();

  const { data, isPending, isError, error } = useInvites(
    getQueryString({ type: "request" })
  );

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

const columns: ColumnDef<CustomerInviteSelectType>[] = [
  {
    id: "name",
    header: "Name",
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
        <div className="flex flex-col">
          <div className="text-sm text-muted-foreground">{phone}</div>
          <div className="text-sm text-muted-foreground">{email}</div>
        </div>
      );
    },
  },
  {
    id: "company",
    header: "Company",
    cell: ({ row }) => {
      const { companyName, companyType } = row.original;
      return (
        <div className="space-y-1">
          <div>{companyName}</div>

          <div className="text-muted-foreground text-sm">{companyType}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Requested",
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
    cell: ({ getValue }) => {
      const status = getValue<string>();

      const map = inviteStatusMap[status as keyof typeof inviteStatusMap];

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
    cell: ({ row }) => (
      <CustomerInviteAction
        id={row.original.id}
        status={row.original.status as keyof typeof inviteStatusMap}
      />
    ),
  },
];
