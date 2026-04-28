"use client";
import React from "react";
import { UserWithMember } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { Lock, MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addUserToOrganization } from "@/server/auth";
import { UserDialog } from "./user-dialog";

export const UserAction = ({ data }: { data: UserWithMember }) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

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

  const handleEditRole = () => {};
  const handleDelete = () => {};

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
      <UserDialog>
        <Button variant="ghost" className="rounded-lg! justify-start">
          <SquarePen /> Edit
        </Button>
      </UserDialog>
      <Button variant="destructive" className="rounded-lg!">
        <Trash2 /> Delete
      </Button>
    </PopoverXDrawer>
  );
};
