"use client";
import React from "react";
import { toast } from "sonner";
import { UserDialog } from "./user-dialog";
import { UserWithMember } from "@/lib/types";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { addUserToOrganization, deleteUser } from "@/server/auth";
import { Lock, MoreVertical, SquarePen, Trash2, XCircle } from "lucide-react";

export const UserAction = ({ data }: { data: UserWithMember }) => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  // assign access
  const handleAssignAccess = async () => {
    setOpen(false);
    const toastId = toast.loading("Please wait...");
    const { success, error } = await addUserToOrganization({
      userId: data?.id,
      role: "member",
    });
    if (success) {
      toast.success("Access assigned successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } else {
      toast.error(error?.message || "Failed to assign access", { id: toastId });
    }
  };

  const handleRemoveUser = () => {
    confirm.warning({
      title: "Are you sure?",
      description:
        "This will remove the user’s access to the selected warehouse.",
      action: async () => {
        const toastId = toast.loading("Please wait...");

        const { error } = await authClient.organization.removeMember({
          memberIdOrEmail: data?.email,
        });
        if (error) {
          toast.error(error?.message, {
            id: toastId,
          });
        } else {
          toast.success("User access removed successfully", { id: toastId });
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }
      },
    });
  };

  const handleDeleteUser = () => {
    confirm.delete({
      title: "Are you sure?",
      description: "This will permanently delete the user account.",
      action: async () => {
        const toastId = toast.loading("Please wait...");
        const { success, error } = await deleteUser(data.id);
        if (!success) {
          toast.error(error?.message, {
            id: toastId,
          });
        } else {
          toast.success("User deleted successfully", { id: toastId });
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }
      },
    });
  };

  return (
    <PopoverXDrawer
      open={open}
      setOpen={setOpen}
      className="w-40"
      trigger={
        <Button size="icon-sm" variant="outline">
          <MoreVertical className="size-5" />
        </Button>
      }
    >
      {!data?.member && (
        <Button
          variant="ghost"
          className="rounded-lg!"
          onClick={handleAssignAccess}
        >
          <Lock /> Assign Access
        </Button>
      )}
      <UserDialog data={data}>
        <Button variant="ghost" disabled className="justify-start rounded-lg!">
          <SquarePen /> Edit
        </Button>
      </UserDialog>

      <Button
        variant="ghost"
        onClick={handleRemoveUser}
        className="rounded-lg! bg-transparent"
      >
        <XCircle /> Remove Access
      </Button>
      <Button
        variant="destructive"
        onClick={handleDeleteUser}
        className="rounded-lg! bg-transparent"
      >
        <Trash2 /> Delete
      </Button>
    </PopoverXDrawer>
  );
};
