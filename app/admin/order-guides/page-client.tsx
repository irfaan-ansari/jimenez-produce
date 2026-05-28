"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { ImageOff, SquarePen, Trash2, User } from "lucide-react";
import { OrderGuideDialog } from "@/features/admin/components/order-guide-dialog";
import { AdminOrderGuide, useAdminOrderGuides } from "@/hooks/use-orders";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatUSD } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteOrderGuide } from "@/server/order-guide";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const PageClient = () => {
  const { data, error, isPending, isError } = useAdminOrderGuides();

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

export const columns: ColumnDef<AdminOrderGuide>[] = [
  {
    accessorKey: "id",
    header: "Name",
    cell: ({ row }) => {
      const { name } = row.original;

      return (
        <div className="flex items-center gap-2 font-medium">
          {name}
          <Badge
            variant="outline"
            className="h-6 gap-1.5 rounded-xl border-green-200 bg-green-100 text-sm"
          >
            Active
          </Badge>
        </div>
      );
    },
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const { items } = row.original;
      return (
        <AvatarGroup>
          {items.slice(0, 4).map((item) => (
            <HoverCard key={item.id}>
              <HoverCardTrigger asChild>
                <Avatar className="bg-background">
                  <AvatarImage src={item.image!} className="object-contain" />
                  <AvatarFallback>
                    <ImageOff className="size-4" />
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent
                className="flex flex-col w-64 p-0 overflow-hidden text-base rounded-xl"
                align="center"
              >
                <div className="relative inline-flex items-center justify-center aspect-video rounded-t-xl bg-secondary">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      width={200}
                      height={200}
                      className="absolute inset-0 object-contain size-full aspect-video mix-blend-multiply"
                    />
                  ) : (
                    <ImageOff className="size-6" />
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="text-base font-medium leading-tight">
                    {item.title}
                  </h4>
                  <div className="text-xs font-medium uppercase text-muted-foreground">
                    {item.categories?.join(" • ")}
                  </div>
                  <div className="font-medium text-primary">
                    {formatUSD(item.basePrice ?? 0)}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}

          {items.length > 4 && (
            <Avatar>
              <AvatarFallback>+{items.length - 4}</AvatarFallback>
            </Avatar>
          )}
        </AvatarGroup>
      );
    },
  },
  {
    id: "assignedTo",
    header: "Assigned to",
    cell: ({ row }) => {
      const { teams } = row.original;
      return (
        <AvatarGroup>
          {teams.slice(0, 4).map((team) => (
            <Tooltip key={team.id} content={team.name}>
              <Avatar>
                <AvatarImage src={team.logo!} />
                <AvatarFallback>
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
            </Tooltip>
          ))}

          {teams.length > 4 && (
            <Tooltip content={`+ ${teams.length - 4} more`}>
              <Avatar>
                <AvatarFallback>+{teams.length - 4}</AvatarFallback>
              </Avatar>
            </Tooltip>
          )}
        </AvatarGroup>
      );
    },
  },
  {
    id: "createdAt",
    meta: {
      className: "w-20",
    },
    header: "Created",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {format(row.original.createdAt!, "MMM dd • hh:mm a")}
        </span>
      );
    },
  },
  {
    id: "action",
    meta: {
      className: "text-right w-10",
    },
    header: "Action",
    cell: ({ row }) => {
      const confirm = useConfirm();
      const queryClient = useQueryClient();
      const { id, name, description, items, teams } = row.original;

      const initialData = {
        id,
        name,
        description: description || "",
        items: items.map((item) => ({
          productId: item.id,
          title: item.title,
          image: item.image,
          price: item.basePrice,
          categories: item.categories || [],
        })),
        teams: teams.map((team) => ({
          ...team,
          teamId: team.id,
        })),
      };

      const handleDelete = async () => {
        confirm.delete({
          title: "Delete Order Guide",
          description: "Are you sure you want to delete this order guide?",
          action: async () => {
            const toastId = toast.loading("Please wait...");
            const { success, error } = await deleteOrderGuide(id);
            if (success) {
              queryClient.invalidateQueries({
                queryKey: ["admin-order-guides"],
              });

              toast.success("Order guide deleted", { id: toastId });
            } else {
              {
                toast.error(error?.message, { id: toastId });
              }
            }
          },
        });
      };
      return (
        <div className="flex items-center justify-end gap-2">
          <OrderGuideDialog initialData={initialData}>
            <Button type="button" variant="outline" size="icon-sm">
              <SquarePen />
            </Button>
          </OrderGuideDialog>
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            onClick={handleDelete}
          >
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];
