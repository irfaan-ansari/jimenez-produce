"use client";

import Link from "next/link";
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { ColumnDef } from "@tanstack/react-table";

import { useRouterStuff } from "@/hooks/use-router-stuff";
import { DataTable } from "@/components/admin/data-table";
import { JobApplicationSelectType } from "@/lib/db/schema";

import { useJobApplications } from "@/hooks/use-job-application";
import { jobApplicationStatusMap } from "@/lib/constants/job";
import { JobApplicationAction } from "@/components/admin/job-application-actions";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();

  const { data, isPending, isError, error } = useJobApplications(
    searchParams.toString()
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

const columns: ColumnDef<JobApplicationSelectType>[] = [
  {
    id: "applicant",
    header: "Applicant",
    cell: ({ row }) => {
      const { firstName, lastName, email, phone, id } = row.original;

      return (
        <Link
          href={`/admin/job-applications/${id}`}
          className="space-y-1 hover:underline"
        >
          <div className="font-medium">
            {firstName} {lastName}
          </div>
          <div className="text-sm text-muted-foreground">{phone}</div>
          <div className="text-sm text-muted-foreground">{email}</div>
        </Link>
      );
    },
  },

  {
    id: "position",
    header: "Position",
    cell: ({ row }) => {
      const { position, createdAt } = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium">{position}</div>
          <div className="text-sm text-muted-foreground">
            Applied: {format(new Date(createdAt!), "dd MMM yyyy")}
          </div>
        </div>
      );
    },
  },
  {
    id: "availability",
    header: "Available",
    cell: ({ row }) => {
      const { availableStartDate, hasLegalRights } = row.original;
      return (
        <div className="space-y-1">
          <div>
            {availableStartDate
              ? format(new Date(availableStartDate), "dd MMM yyyy")
              : "—"}
          </div>

          <div className="text-muted-foreground">
            Legal:{" "}
            <span className="capitalize font-medium">{hasLegalRights}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.currentAddress;
      if (!address) return "—";
      return (
        <div className="space-y-1">
          <div>{address.city}</div>
          <div className="text-muted-foreground">
            {address.state} {address.zip}
          </div>
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
      <JobApplicationAction
        id={row.original.id}
        status={row.original.status as any}
        showView={true}
      />
    ),
  },
];
