"use client";

import Link from "next/link";
import { Team } from "@/lib/types";
import { useTeams } from "@/hooks/use-teams";
import { ColumnDef } from "@tanstack/react-table";
import { CustomerActions } from "./customer-actions";
import { CopyButton } from "@/components/copy-button";
import { DataTable } from "@/components/admin/data-table";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { formatUSD, getInitialsAvatar } from "@/lib/utils";
import { Tooltip } from "@/components/tooltip";

export const PageClient = () => {
  const { searchParamsObj } = useRouterStuff();
  const { data, isPending, error, isError } = useTeams(searchParamsObj);

  // data
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

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "id",
    header: "Name",
    cell: ({ row }) => {
      const team = row.original;
      return (
        <Link
          href={`/admin/customers/${team.id}`}
          className="flex items-center gap-3"
        >
          <Avatar className="size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-lg after:hidden">
            <AvatarImage src={team.logo ?? undefined} alt="profile image" />
            <AvatarFallback className="rounded-xl bg-primary/40 text-xs font-semibold text-primary">
              {team.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="font-medium">{team.name}</span>
            <span className="text-xs font-medium text-muted-foreground">
              Click to view details.
            </span>
          </div>
        </Link>
      );
    },
  },
  {
    id: "managerName",
    header: "Manager",
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium">{row.original.managerName}</span>
      );
    },
  },
  {
    id: "team",
    header: "Contact",
    cell: ({ row }) => {
      const team = row.original;
      return (
        <div className="flex flex-col text-muted-foreground">
          <CopyButton value={team.phone} />
          <CopyButton value={team.email} />
        </div>
      );
    },
  },
  {
    id: "credit",
    header: "Credit",
    cell: ({ row }) => {
      const limit = Number(row.original.creditLimit ?? 0);
      const used = 0;
      const percentUsed = (used / limit) * 100 || 0;

      return (
        <div className="space-y-2.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Used</span>
            <span>{Math.round(percentUsed)}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span>Limit</span>
            <span>{formatUSD(limit)}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "users",
    header: "users",
    cell: ({ row }) => {
      const members = row.original.members ?? [];
      const visible = members.slice(0, 3);
      const remaining = members.length - visible.length;

      return (
        <AvatarGroup>
          {visible.map((member) => (
            <Tooltip key={member.id} content={member.name}>
              <Avatar className="shadow-2xs">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>
                  {getInitialsAvatar(member.name)}
                </AvatarFallback>
              </Avatar>
            </Tooltip>
          ))}
          {remaining > 0 && <AvatarGroupCount>+{remaining}</AvatarGroupCount>}
        </AvatarGroup>
      );
    },
  },

  {
    id: "action",
    meta: {
      className: "w-10",
    },
    cell: ({ row }) => {
      return <CustomerActions data={row.original} showView={true} />;
    },
  },
];
