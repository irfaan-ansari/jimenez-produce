"use client";

import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { ColumnDef } from "@tanstack/react-table";

import { useInvites } from "@/hooks/use-customer";
import { DataTable } from "@/components/admin/data-table";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { CustomerInviteSelectType } from "@/lib/db/schema";

import { format } from "date-fns";
import { CustomerInviteAction } from "@/components/admin/customer-invite-actions";
import { inviteStatusMap } from "@/lib/constants/customer";

export const PageClient = () => {
  const { getQueryString } = useRouterStuff();

  const { data, isPending, isError, error } = useInvites(
    getQueryString({ type: "request" })
  );

  // loading
  if (isPending) return <LoadingSkeleton />;

  // error
  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  return (
    <DataTable
      columns={columns}
      data={data.data}
      pagination={{ ...data.pagination }}
    />
  );
};

const columns: ColumnDef<CustomerInviteSelectType>[] = [
  {
    id: "name",
    header: "Applicant",
    cell: ({ row }) => {
      const { firstName, lastName, createdAt } = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {firstName} {lastName}
          </span>
          <span className="text-sm text-muted-foreground">
            {format(createdAt!, "dd-MM-yyyy")}
          </span>
        </div>
      );
    },
  },

  {
    id: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const { phone, email } = row.original;
      return (
        <div className="space-y-1">
          <div>{phone}</div>
          <div>{email}</div>
        </div>
      );
    },
  },
  {
    id: "business",
    header: "Business",
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
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            variant="link"
            className="max-w-[10ch] truncate text-foreground justify-start"
          >
            {row.original.message}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="whitespace-pre-line">
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
