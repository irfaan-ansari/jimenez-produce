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
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth/client";
import { roleMap } from "@/lib/constants/user";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { useListUsers, useSession } from "@/hooks/use-auth";
import { EmptyComponent } from "@/components/admin/placeholder-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const PageClient = () => {
  const { searchParamsObj } = useRouterStuff();

  const { data: session } = useSession();

  const { data, isPending, isError, error } = useListUsers(searchParamsObj?.q);

  return (
    <div className="flex-1 space-y-3">
      <div className="flex h-full flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border **:data-[slot=table-container]:no-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary text-sm uppercase **:text-muted-foreground">
                <TableHead className="px-4 py-4 font-medium">Name</TableHead>
                <TableHead className="px-4 py-4 font-medium">Email</TableHead>
                <TableHead className="px-4 py-4 font-medium">STATUS</TableHead>
                <TableHead className="px-4 py-4 font-medium">
                  Created At
                </TableHead>
                <TableHead className="px-4 py-4 font-medium"></TableHead>
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
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 after:hidden">
                            <AvatarImage
                              src={row.image ?? undefined}
                              alt="profile image"
                            />
                            <AvatarFallback className="rounded-xl bg-primary/40 text-xs font-semibold text-primary">
                              {row.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start justify-start gap-1">
                            <span className="font-medium">{row.name}</span>

                            {isCurrentUser ? (
                              <Badge
                                variant="secondary"
                                className="rounded-xl font-medium uppercase"
                              >
                                You
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                style={
                                  {
                                    "--color": map.color,
                                  } as React.CSSProperties
                                }
                                className="h-5 gap-1 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-xs [&>svg]:size-3.5"
                              >
                                <map.icon className="text-(--color)" />
                                {map.label}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="grid">
                          <span>{row.email}</span>
                          <span className="text-sm text-muted-foreground">
                            {/* @ts-ignore */}
                            {row.phoneNumber || "###-###-####"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="p-4">
                        <Badge
                          variant="outline"
                          className={`h-7 rounded-xl text-sm ${row.banned ? "bg-red-500/10 text-red-500 border-red-500/10" : "bg-green-500/10 text-green-500 border-green-500/10"}`}
                        >
                          {row.banned ? "Inactive" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="grid text-sm">
                          <span>
                            {format(new Date(row.createdAt), "MMM dd, yyyy")}
                          </span>
                          <span className="text-muted-foreground">
                            {format(new Date(row.createdAt), "hh:mm:ss a")}
                          </span>
                        </div>
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
                  <TableCell colSpan={5} className="h-24 p-0 text-center">
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

const DeleteAction = ({ id }: { id: string }) => {
  const router = useRouter();
  const { error } = useConfirm();

  const handleDelete = () => {
    error({
      title: "Delete User?",
      description:
        "This action will permanently delete this user. This cannot be undone.",
      actionLabel: "Delete User",
      cancelLabel: "Cancel",
      action: async () => {
        await authClient.admin.removeUser({
          userId: id,
          fetchOptions: {
            onSuccess: () => router.refresh(),
          },
        });
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
