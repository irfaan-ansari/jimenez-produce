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
import { useRouterStuff } from "@/hooks/use-router-stuff";

import { EmptyComponent } from "@/components/admin/placeholder-component";
import { useTeamMembers, useTeams } from "@/hooks/use-teams";
import { CustomerActions } from "./customer-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export const PageClient = () => {
  const { searchParamsObj } = useRouterStuff();
  const { data: teams, isPending, error } = useTeams();

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border **:data-[slot=table-container]:no-scrollbar">
        <Table className="bg-background">
          <TableHeader>
            <TableRow className="bg-secondary text-sm uppercase **:text-muted-foreground">
              <TableHead className="px-4 py-4 font-medium">Name</TableHead>
              <TableHead className="px-4 py-4 font-medium">Manager</TableHead>
              <TableHead className="px-4 py-4 font-medium">Contact</TableHead>
              <TableHead className="px-4 py-4 font-medium">Members</TableHead>
              <TableHead className="px-4 py-4 font-medium">
                Created At
              </TableHead>
              <TableHead className="px-4 py-4 font-medium"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams?.length ? (
              teams.map((team) => {
                return (
                  <TableRow key={team.id}>
                    <TableCell className="p-4 font-medium">
                      <Link
                        href={`/admin/customers/${team.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-lg after:hidden">
                          <AvatarImage
                            src={team.logo ?? undefined}
                            alt="profile image"
                          />
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
                    </TableCell>

                    <TableCell className="p-4">{team.managerName}</TableCell>
                    <TableCell className="p-4">
                      <div className="flex flex-col gap-1 text-muted-foreground">
                        <span>{team.email}</span>
                        <span>{team.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <Members teamId={team.id} />
                    </TableCell>
                    <TableCell className="w-28 p-4 font-medium text-muted-foreground">
                      {format(new Date(team.createdAt), "MMM dd • hh:mm:ss a")}
                    </TableCell>
                    <TableCell className="w-20 p-4">
                      <CustomerActions data={team} showView={true} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 p-0 text-center">
                  {isPending ? (
                    <div className="mb-36 h-1 animate-pulse rounded-full bg-primary"></div>
                  ) : error ? (
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
  );
};

const Members = ({ teamId }: { teamId: string }) => {
  const { data: members, isPending, error } = useTeamMembers(teamId);
  console.log(error);
  return (
    <div className="flex items-center">
      {members?.map((member) => {
        return (
          <Avatar
            className="size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-lg after:hidden"
            key={member.id}
          >
            <AvatarFallback className="rounded-xl bg-primary/40 text-xs font-semibold text-primary">
              {member.id?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        );
      })}
    </div>
  );
};
