"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { format } from "date-fns";
import { ImageOff, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { PromotionAction } from "./promotion-action";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { DataTable } from "@/components/admin/data-table";
import { PromotionTypeWithTeam, usePromotions } from "@/hooks/data/promotions";

const PageClient = () => {
  const { searchParamsObj } = useRouterStuff();

  const { data, isPending, isError, error } = usePromotions(searchParamsObj);

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

export const columns: ColumnDef<PromotionTypeWithTeam>[] = [
  {
    accessorKey: "id",
    header: "Promotion",
    cell: ({ row }) => {
      const { name, status } = row.original;
      const map = STATUS_MAP[status as keyof typeof STATUS_MAP];
      return (
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
      );
    },
  },
  {
    accessorKey: "media",
    header: "Media",
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage
            width={40}
            height={40}
            src={row.original.media ?? ""}
            alt={row.original.name ?? ""}
          />
          <AvatarFallback>
            <ImageOff className="size-4" />
          </AvatarFallback>
        </Avatar>
      );
    },
  },

  {
    id: "products",
    header: "Products",
    cell: ({ row }) => {
      const { products } = row.original;

      const visible = products.slice(0, 3);
      const remaining = products.length - visible.length;

      if (products.length == 0) {
        return <span className="text-sm text-muted-foreground">NA</span>;
      }
      return (
        <AvatarGroup>
          {visible.map((product) => (
            <Tooltip key={product.id} content={product.title}>
              <Avatar>
                <AvatarImage
                  width={40}
                  height={40}
                  src={product.image!}
                  alt={product.title}
                />
                <AvatarFallback>
                  <ImageOff className="size-4" />
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
    id: "visibility",
    header: "Visibility",
    cell: ({ row }) => {
      const { target, teams } = row.original;
      if (target === "all") {
        return <Badge variant="warning-outline">All Customers</Badge>;
      }

      const visible = teams.slice(0, 3);
      const remaining = teams.length - visible.length;

      return (
        <AvatarGroup>
          {visible.map((team) => (
            <Tooltip key={team.id} content={team.name}>
              <Avatar>
                <AvatarImage src={team.logo!} alt={team.name} />
                <AvatarFallback>
                  <User className="size-4" />
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
    header: "Action",
    meta: {
      className: "w-10",
    },
    cell: ({ row }) => {
      return <PromotionAction data={row.original} />;
    },
  },
];

export default PageClient;
