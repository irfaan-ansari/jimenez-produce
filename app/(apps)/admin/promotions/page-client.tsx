"use client";
import { Badge } from "@/components/ui/badge";
import { PromotionResponse, usePromotions } from "@/hooks/data/promotions";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

const PageClient = () => {
  const { searchParamsObj } = useRouterStuff();

  const { data, isPending, isError, error } = usePromotions();

  return <div>Promotions page client</div>;
};

export const columns: ColumnDef<PromotionResponse["data"]>[] = [
  {
    accessorKey: "id",
    header: "Name",
    cell: ({ row }) => {
      const { name, title, status } = row.original;

      return (
        <div className="flex items-center gap-2">
          {title}
          <Badge
            variant="outline"
            className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.member?.role;
      if (!role)
        return (
          <span className="inline-block w-20 rounded-md h-7 bg-secondary" />
        );

      const {
        label,
        color,
        icon: Icon,
      } = roleMap[role as keyof typeof roleMap];

      return (
        <Badge
          className="h-7 rounded-md border-(--color)/20 bg-(--color)/10 text-sm text-(--color)"
          style={
            {
              "--color": color,
            } as React.CSSProperties
          }
        >
          <Icon />
          {label}
        </Badge>
      );
    },
  },
  {
    id: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const { phoneNumber, email } = row.original;
      return (
        <div className="flex flex-col text-muted-foreground">
          <CopyButton value={phoneNumber!} />
          <CopyButton value={email} />
        </div>
      );
    },
  },

  {
    id: "last-login",
    header: "Last Login",
    cell: ({ row }) => {
      const { lastLogin } = row.original;
      return (
        <span className="text-muted-foreground">
          {lastLogin ? format(new Date(lastLogin), "MMM dd • hh:mm a") : "-"}
        </span>
      );
    },
  },

  {
    id: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const { createdAt } = row.original;
      return (
        <span className="text-muted-foreground">
          {createdAt ? format(new Date(createdAt), "MMM dd • hh:mm a") : "-"}
        </span>
      );
    },
  },

  {
    id: "action",
    header: "",
    meta: {
      className: "w-10",
    },
    cell: ({ row }) => {
      return <UserAction data={row.original} />;
    },
  },
];

export default PageClient;
