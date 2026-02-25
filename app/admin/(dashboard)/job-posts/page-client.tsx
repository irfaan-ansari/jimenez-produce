"use client";

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
import { JobPostSelectType } from "@/lib/db/schema";

import { useJobPosts } from "@/hooks/use-job-application";
import { JobPostAction } from "@/components/admin/job-post-actions";
import { jobPostStatusMap } from "@/lib/constants/job";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();

  const { data, isPending, isError, error } = useJobPosts(
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

const columns: ColumnDef<JobPostSelectType>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => {
      const { categories } = row.original;
      if (!categories || categories?.length <= 0) return "-";
      return (
        <div className="flex flex-wrap gap-2">
          {categories?.map((cat) => (
            <Badge variant="secondary" className="h-7 rounded-xl text-sm">
              {cat}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "form",
    header: "Form",
    cell: ({ row }) => (
      <span className="font-medium uppercase">{row.original.form}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<string>();

      const map = jobPostStatusMap[status as keyof typeof jobPostStatusMap];

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
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span>{format(row.original.createdAt!, "yyyy-MM-dd")}</span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return <JobPostAction post={row.original as any} showView={true} />;
    },
  },
];
