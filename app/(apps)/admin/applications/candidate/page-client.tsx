"use client";

import Link from "next/link";
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { DataTable } from "@/components/admin/data-table";
import { JobApplicationSelectType } from "@/lib/db/schema";
import { jobApplicationStatusMap } from "@/lib/constants/job";
import { useJobApplications } from "@/hooks/use-job-application";
import { JobApplicationAction } from "@/components/admin/job-application-actions";
import { CopyButton } from "@/components/copy-button";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();

  const { data, isPending, isError, error } = useJobApplications(
    searchParams.toString(),
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

const columns: ColumnDef<JobApplicationSelectType>[] = [
  {
    id: "name",
    header: "Applicant",
    cell: ({ row }) => {
      const { firstName, lastName, id, position, location } = row.original;
      return (
        <Link
          href={`/admin/applications/candidate/${id}`}
          className="flex flex-col gap-1.5"
        >
          <span className="font-medium">
            {firstName} {lastName}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {position} • {location}
          </span>
        </Link>
      );
    },
  },
  {
    id: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const { email, phone } = row.original;

      return (
        <div className="space-y-0">
          <CopyButton value={phone} />
          <CopyButton value={email} />
        </div>
      );
    },
  },

  {
    id: "availability",
    header: "Availability",
    cell: ({ row }) => {
      const { availableStartDate, hasLegalRights } = row.original;
      return (
        <div className="space-y-1">
          <div>
            {availableStartDate
              ? format(new Date(availableStartDate), "MMMM dd, yyyy")
              : "—"}
          </div>

          <div className="text-xs text-muted-foreground">
            Legal rights • <span className="capitalize">{hasLegalRights}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Applied",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span>{format(row.original.createdAt!, "MMMM dd")}</span>
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
    cell: ({ getValue }) => {
      const status = getValue<string>();

      const map =
        jobApplicationStatusMap[status as keyof typeof jobApplicationStatusMap];

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

    meta: {
      className: "w-10",
    },
    cell: ({ row }) => (
      <JobApplicationAction showView={true} initialValues={row.original} />
    ),
  },
];
