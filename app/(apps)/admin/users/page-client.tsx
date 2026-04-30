"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { UserAction } from "./user-actions";
import { Badge } from "@/components/ui/badge";
import { roleMap } from "@/lib/constants/user";
import { getInitialsAvatar } from "@/lib/utils";
import { CopyButton } from "@/components/copy-button";
import { useRouterStuff } from "@/hooks/use-router-stuff";

import { useUsers } from "@/hooks/use-teams";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { UserWithMember } from "@/lib/types";
import { DataTable } from "@/components/admin/data-table";

export const PageClient = () => {
  const { searchParamsObj } = useRouterStuff();

  const { data, isPending, isError, error } = useUsers({
    q: searchParamsObj?.q,
    accountType: "admin",
  });

  return (
    <DataTable
      columns={columns}
      data={{ data: data?.data!, pagination: undefined }}
      isPending={isPending}
      isError={isError}
      error={error}
    />
  );
};

export const columns: ColumnDef<UserWithMember>[] = [
  {
    accessorKey: "id",
    header: "Name",
    cell: ({ row }) => {
      const { name, image, isCurrentUser } = row.original;

      return (
        <div
          className="group flex items-center gap-3"
          data-active={isCurrentUser}
        >
          <Avatar className="relative size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-lg after:hidden">
            <AvatarImage src={image ?? undefined} alt="profile image" />
            <AvatarFallback className="rounded-xl bg-foreground text-xs font-semibold text-background">
              {getInitialsAvatar(name)}
            </AvatarFallback>
            <span className="absolute -right-1 -bottom-1 size-3 border-2 bg-green-500 opacity-0 group-data-active:opacity-100"></span>
          </Avatar>

          <span className="font-medium">{name}</span>
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
          <span className="inline-block h-7 w-20 rounded-md bg-secondary" />
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
