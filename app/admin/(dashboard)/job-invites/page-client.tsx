"use client";

import Link from "next/link";
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { ColumnDef } from "@tanstack/react-table";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { DataTable } from "@/components/admin/data-table";
import { JobInviteSelectType } from "@/lib/db/schema";
import { inviteStatusMap } from "@/lib/constants/customer";
import { CustomerInviteAction } from "@/components/admin/customer-invite-actions";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useJobInvites } from "@/hooks/use-job-application";

export const PageClient = () => {
  const { getQueryString } = useRouterStuff();

  const { data, isPending, isError, error } = useJobInvites(getQueryString());

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

export const columns: ColumnDef<JobInviteSelectType>[] = [
  {
    id: "fullName",
    header: "Name",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => {
      const { firstName, lastName, createdAt } = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {firstName} {lastName}
          </span>
          <span className="text-sm text-muted-foreground">
            {format(createdAt!, "MMMM dd, yyyy")}
          </span>
        </div>
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
          <span>{phone}</span>
          <span>{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => {
      const { position, positionSlug } = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{position}</span>
          <span className="text-sm text-muted-foreground">{positionSlug}</span>
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
            className="max-w-[10ch] truncate text-foreground"
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
    cell: ({ row }) => {
      const { status, applicationId } = row.original;

      const map = inviteStatusMap[status as keyof typeof inviteStatusMap];

      return (
        <Badge
          variant="outline"
          style={{ "--color": map.color } as React.CSSProperties}
          className="h-7 rounded-xl pl-1.5 pr-2.5 gap-1.5 [&>svg]:size-3.5! bg-(--color)/10 border-(--color)/10 text-sm"
        >
          <map.icon className="text-(--color)" />

          {map.label}

          {applicationId && (
            <Link
              href={`/admin/job-applications/${applicationId}`}
              className="text-xs text-primary underline"
            >
              View
            </Link>
          )}
        </Badge>
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
