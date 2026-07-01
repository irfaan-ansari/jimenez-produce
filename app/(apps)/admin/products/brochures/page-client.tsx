"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { Brochure, useBrochures } from "@/hooks/brochure";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { format } from "date-fns/format";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  ChartNoAxesColumn,
  FileText,
  ImageOff,
  Link,
  MoreVertical,
  Share2,
  SquarePen,
  Trash2,
} from "lucide-react";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/tooltip";
import { Badge } from "@/components/ui/badge";
import BrochureDialog from "./brochure-dialog";
import { id } from "date-fns/locale/id";
import { CopyButton } from "@/components/copy-button";
import BrochureShareDialog from "./share-dialog";

export const PageClient = () => {
  const { searchParamsObj } = useRouterStuff();

  const { data, error, isPending, isError } = useBrochures(searchParamsObj);

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

const columns: ColumnDef<Brochure>[] = [
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      const { effectiveFrom, effectiveTo, name } = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium">{name}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{format(effectiveFrom, "MMMM dd hh:mm")}</span>
            <span>•</span>
            <span>{format(effectiveTo || new Date(), "MMMM dd hh:mm")}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "featured",
    header: "Featurd",
    cell: ({ row }) => {
      const { products } = row.original;
      return (
        <AvatarGroup>
          {products.map((product) => (
            <Tooltip key={product.id} content={product.title}>
              <Avatar className="size-10 ring-2 ring-ring hover:z-1">
                <AvatarImage src={product.image ?? ""} />
                <AvatarFallback>
                  <ImageOff className="size-4" />
                </AvatarFallback>
              </Avatar>
            </Tooltip>
          ))}
        </AvatarGroup>
      );
    },
  },
  {
    id: "views",
    header: "PDF",
    cell: ({ row }) => {
      return (
        <span className="text-xs text-muted-foreground inline-flex items-center gap-2">
          <Link className="size-4" />
          <CopyButton
            value={row.original.pdfUrl}
            className="[&>span]:w-24 [&>span]:truncate"
          />
        </span>
      );
    },
  },
  {
    id: "views",
    header: "Views",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="h-7 px-2 shadow-sm bg-secondary/50">
          <ChartNoAxesColumn className="size-3.5" /> {row.original.views.length}{" "}
          Views
        </Badge>
      );
    },
  },

  {
    id: "action",
    meta: {
      className: "w-10",
    },
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      const { id, name, effectiveTo, products, pdfUrl } = row.original;

      const defaultValues = {
        id,
        name,
        effectiveTo: format(effectiveTo, "yyyy-MM-dd"),
        products: products.map((product) => ({
          ...product,
          image: product.image ?? "",
        })),
      };

      return (
        <PopoverXDrawer
          open={open}
          setOpen={setOpen}
          trigger={
            <Button size="icon" variant="outline" className="rounded-lg">
              <MoreVertical className="size-5" />
            </Button>
          }
        >
          <BrochureDialog defaultValues={defaultValues}>
            <Button variant="ghost" className="justify-start">
              <SquarePen /> Edit
            </Button>
          </BrochureDialog>
          <BrochureShareDialog id={id} pdfUrl={pdfUrl}>
            <Button variant="ghost" className="justify-start">
              <Share2 /> Share
            </Button>
          </BrochureShareDialog>
          <Button variant="ghost" asChild>
            <a href={pdfUrl} target="_blank">
              <FileText /> View PDF
            </a>
          </Button>
          <Button variant="destructive">
            <Trash2 /> Delete
          </Button>
        </PopoverXDrawer>
      );
    },
  },
];
