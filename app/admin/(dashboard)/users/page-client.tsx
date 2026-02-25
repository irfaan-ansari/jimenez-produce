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
import { Badge } from "@/components/ui/badge";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { roleMap } from "@/lib/constants/user";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { useListUsers, useSession } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConfirm } from "@/hooks/use-confirm";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();
  const { data: session } = useSession();
  const { data, isPending, isError, error } = useListUsers(
    searchParams?.toString()
  );

  if (isPending) return <LoadingSkeleton />;

  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  return (
    <div className="flex-1 space-y-3">
      <div className="flex flex-col h-full gap-3">
        <div className="overflow-hidden **:data-[slot=table-container]:no-scrollbar rounded-2xl border">
          <Table className="text-base">
            <TableHeader>
              <TableRow className="bg-sidebar">
                <TableHead className="py-4 px-4 font-medium">Name</TableHead>
                <TableHead className="py-4 px-4 font-medium">Email</TableHead>
                <TableHead className="py-4 px-4 font-medium">Role</TableHead>
                <TableHead className="py-4 px-4 font-medium">
                  Created At
                </TableHead>
                <TableHead className="py-4 px-4 font-medium"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.users?.length ? (
                data?.users?.map((row) => {
                  const isCurrentUser = session?.user?.id === row.id;
                  const map =
                    roleMap[(row.role as keyof typeof roleMap) || "user"];

                  return (
                    <TableRow key={row.id}>
                      <TableCell className="p-4">
                        <div className="flex gap-3 items-center">
                          <Avatar className="rounded-xl size-9 ring-2 ring-offset-1 ring-green-600/20">
                            <AvatarImage
                              src={row.image ?? undefined}
                              alt="profile image"
                            />
                            <AvatarFallback className="rounded-xl bg-primary/40 font-semibold text-xs text-primary">
                              {row.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <span className="font-medium">{row.name}</span>
                          {isCurrentUser && (
                            <Badge
                              variant="secondary"
                              className="uppercase font-medium rounded-xl"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <span className="text-muted-foreground">
                          {row.email}
                        </span>
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge
                          variant="outline"
                          style={
                            { "--color": map.color } as React.CSSProperties
                          }
                          className="h-7 rounded-xl pl-1.5 pr-2.5 gap-1.5 [&>svg]:size-3.5 bg-(--color)/10 border-(--color)/10 text-sm"
                        >
                          <map.icon className="text-(--color)" />
                          {map.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4">
                        <span>
                          {format(new Date(row.createdAt), "dd-MM-yyyy")}
                        </span>
                      </TableCell>
                      <TableCell className="p-4">
                        {session?.user.role === "admin" &&
                        row.id !== session?.user.id ? (
                          <DeleteAction id={row.id} />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <EmptyComponent variant="empty" />
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

const DeleteAction = ({ id }: { id: string }) => {
  const { error } = useConfirm();
  const router = useRouter();
  const handleDelete = () => {
    error({
      title: "Permanently Delete User?",
      description:
        "This action will permanently delete this user and remove all associated data. This cannot be undone.",
      actionLabel: "Delete User",
      cancelLabel: "Cancel",
      action: async () => {
        await authClient.admin.removeUser(
          { userId: id },
          {
            onSuccess: () => {
              router.refresh();
            },
          }
        );
      },
    });
  };
  return (
    <Button
      className="rounded-xl"
      onClick={handleDelete}
      variant="destructive"
      size="icon"
    >
      <Trash2 />
    </Button>
  );
};
