"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { DataTable } from "@/components/admin/data-table";
import { useMessages } from "@/hooks/data/messages";
import { MessageSelectType } from "@/lib/db/schema";

const PageClient = () => {
  const { searchParamsObj } = useRouterStuff();

  const { data, isPending, isError, error } = useMessages(searchParamsObj);

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

export const columns: ColumnDef<MessageSelectType>[] = [
  {
    accessorKey: "id",
    header: "Message",
    cell: ({ row }) => {
      const { name, status, createdAt } = row.original;
      const map =
        STATUS_MAP[status as keyof typeof STATUS_MAP] ?? STATUS_MAP.all;
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {name}
            <Badge
              variant="outline"
              style={{ "--color": map.color } as React.CSSProperties}
              className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
            >
              <map.icon className="text-(--color)" />
              {map.label}
            </Badge>
          </div>
          <span className="text-muted-foreground text-sm">
            {format(createdAt, "MMM dd • hh:mm a")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "recipient",
    header: "Send to",
    cell: ({ row }) => {
      const { audienceType, metadata } = row.original;
      return (
        <span className="capitalize">
          {(metadata as Record<string, number>)?.total}{" "}
          {audienceType.replace("team", "Customer")}
        </span>
      );
    },
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => (
      <div className="max-w-2xs whitespace-pre-line wrap-break-word text-muted-foreground">
        {row.original.content}
      </div>
    ),
  },
  {
    id: "stats",
    header: "Stats",
    cell: ({ row }) => {
      const { metadata } = row.original;

      const {
        total,
        sent = 0,
        failed = 0,
      } = metadata as Record<string, number>;

      return (
        <div className="flex flex-col gap-2 items-start">
          <Badge variant="success-light" className="h-5">
            {sent} Sent
          </Badge>
          <Badge variant="destructive" className="h-5">
            {failed} Failed
          </Badge>
        </div>
      );
    },
  },
];

export default PageClient;
