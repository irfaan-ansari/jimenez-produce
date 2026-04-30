"use client";

import { Eye, MoreVertical, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Team } from "@/lib/types";
import { useConfirm } from "@/hooks/use-confirm";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { useQueryClient } from "@tanstack/react-query";
import { CustomerDialog } from "./customer-dialog";
import { authClient } from "@/lib/auth/client";
import { UserDialog } from "../users/user-dialog";
import { AddUserDialog } from "./add-user-dialog";

export const CustomerActions = ({
  showView,
  data,
}: {
  data: Team;
  showView?: boolean;
}) => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { id } = data;

  const onDelete = async () => {
    await confirm.delete({
      title: "Delete account",
      description: "Are you sure you want to delete this customer account?",
      actionLabel: "Yes, Delete",
      action: async () => {
        const toastId = toast.loading("Deleting customer...");
        const { error } = await authClient.organization.removeTeam({
          teamId: id,
        });

        if (error) {
          toast.error(error.message, { id: toastId });
        } else {
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["teams"] });
          toast.success("Customer deleted successfully", { id: toastId });
        }
      },
    });
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
      {showView && (
        <Button
          type="button"
          variant="ghost"
          className="flex items-center gap-2"
          asChild
        >
          <Link href={`/admin/customers/${id}`}>
            <Eye />
            View
          </Link>
        </Button>
      )}

      <CustomerDialog data={data}>
        <Button variant="ghost" className="justify-start">
          <SquarePen /> Edit
        </Button>
      </CustomerDialog>
      <AddUserDialog teamId={id}>
        <Button variant="ghost" className="justify-start">
          <SquarePen />
          Add User
        </Button>
      </AddUserDialog>

      <Button
        variant="ghost"
        className="hover:bg-destructive/10 hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 /> Delete
      </Button>
    </PopoverXDrawer>
  );
};
