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
import { SquarePen } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { WarehouseDialog } from "@/components/admin/warehouse-dialog";
import { EmptyComponent } from "@/components/admin/placeholder-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const PageClient = () => {
  const {
    data: organizations,
    isPending,
    error,
  } = authClient.useListOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border **:data-[slot=table-container]:no-scrollbar">
        <Table className="bg-background">
          <TableHeader>
            <TableRow className="bg-secondary text-sm uppercase **:text-muted-foreground">
              <TableHead className="px-4 py-4 font-medium">Name</TableHead>
              <TableHead className="px-4 py-4 font-medium">Phone</TableHead>
              <TableHead className="px-4 py-4 font-medium">Email</TableHead>
              <TableHead className="px-4 py-4 font-medium">Address</TableHead>
              <TableHead className="px-4 py-4 font-medium">
                Created At
              </TableHead>
              <TableHead className="px-4 py-4 font-medium"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations?.length ? (
              organizations.map((org) => {
                const metadata = JSON.parse(org.metadata);
                return (
                  <TableRow key={org.id}>
                    <TableCell className="p-4">
                      <div
                        className="flex items-center gap-3 group"
                        data-active={org.id === activeOrganization?.id}
                      >
                        <Avatar className="size-9 relative rounded-lg ring-2 ring-green-600/40 ring-offset-1 **:rounded-lg after:hidden">
                          <AvatarImage
                            src={org.logo ?? undefined}
                            alt="profile image"
                          />
                          <AvatarFallback className="rounded-xl bg-primary/40 text-xs font-semibold text-primary">
                            {org.name?.[0]?.toUpperCase()}
                          </AvatarFallback>
                          <span className="absolute size-3 border-2 group-data-active:opacity-100 opacity-0 -bottom-1 -right-1 bg-green-500"></span>
                        </Avatar>
                        <span className="font-medium">{org.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">{org.phone}</TableCell>
                    <TableCell className="p-4">{org.email}</TableCell>
                    <TableCell className="p-4">
                      {metadata?.street}, {metadata?.city}, {metadata?.state},{" "}
                      {metadata?.zip}
                    </TableCell>
                    <TableCell className="w-28 p-4 font-medium text-muted-foreground">
                      {format(new Date(org.createdAt), "MMM dd • hh:mm:ss a")}
                    </TableCell>
                    <TableCell className="w-20 p-4">
                      <WarehouseDialog data={{ ...org, metadata }}>
                        <Button size="icon" variant="outline">
                          <SquarePen />
                        </Button>
                      </WarehouseDialog>
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
