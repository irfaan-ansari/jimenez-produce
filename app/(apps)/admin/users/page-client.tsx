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
import { EmptyComponent } from "@/components/admin/placeholder-component";
import { useUsers, useActiveOrganizationMember } from "@/hooks/use-teams";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const PageClient = () => {
  const { searchParamsObj } = useRouterStuff();
  const { data: activeMember } = useActiveOrganizationMember();
  const { data, isPending, isError, error } = useUsers(searchParamsObj?.q);

  return (
    <div className="flex-1 space-y-3">
      <div className="flex h-full flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border **:data-[slot=table-container]:no-scrollbar">
          <Table className="bg-background">
            <TableHeader>
              <TableRow className="bg-secondary text-sm uppercase **:text-muted-foreground">
                <TableHead className="px-4 py-4 font-medium">Name</TableHead>
                <TableHead className="px-4 py-4 font-medium">Role</TableHead>
                <TableHead className="px-4 py-4 font-medium">Contact</TableHead>
                <TableHead className="px-4 py-4 font-medium">
                  Last Active
                </TableHead>
                <TableHead className="px-4 py-4 font-medium">
                  Created At
                </TableHead>
                <TableHead className="px-4 py-4 font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.length ? (
                data?.data?.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      data-active={row.member}
                      className="[&[data-active=false]>td:not(:last-child)]:opacity-50"
                    >
                      <TableCell className="p-4">
                        <div
                          className="group flex items-center gap-3"
                          data-active={activeMember?.userId === row.id}
                        >
                          <Avatar className="relative size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-lg after:hidden">
                            <AvatarImage
                              src={row.image ?? undefined}
                              alt="profile image"
                            />
                            <AvatarFallback className="rounded-xl bg-foreground text-xs font-semibold text-background">
                              {getInitialsAvatar(row.name)}
                            </AvatarFallback>
                            <span className="absolute -right-1 -bottom-1 size-3 border-2 bg-green-500 opacity-0 group-data-active:opacity-100"></span>
                          </Avatar>

                          <span className="font-medium">{row.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <RoleBadge role={row.member?.role} />
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex flex-col text-muted-foreground">
                          <CopyButton value={row.phoneNumber!} />
                          <CopyButton value={row.email} />
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-muted-foreground">
                        {row.lastLogin
                          ? format(new Date(row.lastLogin), "MMM dd • hh:mm a")
                          : "-"}
                      </TableCell>

                      <TableCell className="w-28 p-4 text-muted-foreground">
                        {format(new Date(row.createdAt), "MMM dd • hh:mm a")}
                      </TableCell>
                      <TableCell className="w-24 p-4">
                        <UserAction data={row} />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 p-0 text-center">
                    {isPending ? (
                      <div className="mb-36 h-1 animate-pulse rounded-full bg-primary"></div>
                    ) : isError ? (
                      <EmptyComponent variant="error" title={error?.message} />
                    ) : (
                      <EmptyComponent variant="empty" />
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

const RoleBadge = ({ role }: { role: string | undefined }) => {
  if (!role)
    return <span className="w-20 h-7 rounded-md bg-secondary inline-block" />;

  const { label, color, icon: Icon } = roleMap[role as keyof typeof roleMap];

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
};
