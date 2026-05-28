"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { ColumnDef } from "@tanstack/react-table";
import { useTaxRules } from "@/hooks/use-product";
import { deleteTaxRule } from "@/server/tax-rule";
import { TaxRuleDialog } from "../../../../features/admin/components/tax-rule-dialog";
import { TaxRuleSelectType } from "@/lib/db/schema";
import { DataTable } from "@/components/admin/data-table";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { MoreVertical, SquarePen, Trash } from "lucide-react";
import { PopoverXDrawer } from "@/components/popover-x-drawer";

export const PageClient = () => {
  const { searchParams } = useRouterStuff();

  const query = Object.fromEntries(searchParams.entries()) as Record<
    string,
    string
  >;

  const { data, error, isPending, isError } = useTaxRules(query);

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

export const columns: ColumnDef<TaxRuleSelectType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <span className="font-medium text-sm leading-none">
          {row.original.name}
        </span>
      );
    },
  },

  {
    accessorKey: "rate",
    header: "Tax Rate %",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {row.original.rate}%
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    meta: {
      className: "w-10",
    },
    header: "",
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      const confirm = useConfirm();

      const handleDelete = () => {
        confirm.delete({
          title: "Delete Tax Rule",
          description: "Are you sure you want to delete this tax rule?",
          action: async () => {
            const toastId = toast.loading("Please wait...");
            const { error } = await deleteTaxRule(row.original.id);

            if (error) {
              toast.error(error.message, { id: toastId });
            } else {
              toast.success("Tax rule deleted successfully", {
                id: toastId,
              });
              setOpen(false);
            }
          },
        });
      };
      return (
        <PopoverXDrawer
          open={open}
          setOpen={setOpen}
          trigger={
            <Button size="icon-sm" variant="outline" className="rounded-lg">
              <MoreVertical className="size-5" />
            </Button>
          }
        >
          <TaxRuleDialog data={row.original as any}>
            <Button variant="ghost" className="justify-start w-full rounded-lg">
              <SquarePen /> Edit
            </Button>
          </TaxRuleDialog>
          <Button
            variant="destructive"
            className="rounded-lg!"
            onClick={handleDelete}
          >
            <Trash /> Delete
          </Button>
        </PopoverXDrawer>
      );
    },
  },
];
