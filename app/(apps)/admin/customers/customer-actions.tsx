"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Team } from "@/lib/types";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { CustomerDialog } from "./customer-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { Eye, MoreVertical, SquarePen, Trash2, User } from "lucide-react";

export const CustomerActions = ({
  showView,
  data,
}: {
  data: Team;
  showView?: boolean;
}) => {
  const { id } = data;
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

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

  // const handleAssignUser = async (user: any) => {
  //   const userId = user.id;
  //   if (!userId) return;
  //   const toastId = toast.loading("Please wait...");

  //   const exist = data.members?.some((m) => m.id === userId);

  //   if (exist) {
  //     toast.error("User already assigned", { id: toastId });
  //     return;
  //   }
  //   const { error } = await authClient.organization.addTeamMember({
  //     teamId: data.id,
  //     userId: userId,
  //   });

  //   if (error) {
  //     toast.error(error?.message, { id: toastId });
  //   } else {
  //     setOpen(false);

  //     toast.success("User added successfully", { id: toastId });
  //   }

  //   queryClient.invalidateQueries({ queryKey: ["teams"] });
  // };

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
