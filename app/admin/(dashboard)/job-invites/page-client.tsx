"use client";

import Link from "next/link";
import React from "react";
import { format } from "date-fns";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { ColumnDef } from "@tanstack/react-table";
import { JobInviteSelectType } from "@/lib/db/schema";
import { jobInviteStatusMap } from "@/lib/constants/job";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { DataTable } from "@/components/admin/data-table";
import { useJobInvites } from "@/hooks/use-job-application";
import { JobInviteActions } from "@/components/admin/job-invite-actions";

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
        <a
          target="_blank"
          className="flex gap-2 items-center hover:underline"
          href={`https://jimenezproduce.com/careers/${positionSlug}`}
        >
          {position}
          <ExternalLink className="size-4" />
        </a>
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

      const map = jobInviteStatusMap[status as keyof typeof jobInviteStatusMap];

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
              target="_blank"
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
      <JobInviteActions
        status={row.original.status as keyof typeof jobInviteStatusMap}
        id={row.original.id}
      />
    ),
  },
];
