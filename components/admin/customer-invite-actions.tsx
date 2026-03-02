"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { MoreVertical, Trash2 } from "lucide-react";
import { PopoverXDrawer } from "../popover-x-drawer";
import { inviteStatusMap } from "@/lib/constants/customer";
import { deleteInvite, updateInvite } from "@/server/customer";
import { CustomerInviteStatusDialog } from "./customer-invite-status-dialog";

type Status = keyof typeof inviteStatusMap;

interface Props {
  status: Status;
  id: number;
}
export const CustomerInviteAction = ({ id, status }: Props) => {
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [variant, setVariant] = useState("revoked");

  const availableActions =
    inviteStatusMap[status as keyof typeof inviteStatusMap].actions;

  const handleAction = (action: string) => {
    switch (action) {
      case "revoked":
      case "rejected":
        setVariant(action);
        setOpenDialog(true);
        break;
      // approve
      case "approved":
        confirm.info({
          title: "Are you sure?",
          description:
            "This action will approve the request and update its status.",
          actionLabel: "Yes, Approve",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await updateInvite(id, {
              status: "approved",
            });
            if (success) {
              toast.success("Request approved successfully.");
            } else {
              toast.error(error.message);
            }
          },
        });
        break;

      // move to new
      case "new":
        confirm.info({
          title: "Move to New?",
          description:
            "This will move the application back to the review stage and update its status to 'New'.",
          actionLabel: "Yes, Move",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await updateInvite(id, {
              status: "new",
            });
            if (success) {
              toast.success("Request moved to new successfully");
            } else {
              toast.error(error.message);
            }
          },
        });
        break;

      case "delete":
        confirm.delete({
          title: "Delete Application",
          description:
            "This action will permanently remove the application and this cannot be undone.",
          actionLabel: "Yes, Delete",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await deleteInvite(id);
            if (success) {
              toast.success("Application deleted successfully");
            } else {
              toast.error(error.message);
            }
          },
        });
    }
  };

  return (
    <PopoverXDrawer
      open={open}
      setOpen={setOpen}
      trigger={
        <Button size="icon" variant="outline" className="rounded-xl">
          <MoreVertical className="size-5" />
        </Button>
      }
    >
      {availableActions.map((action) => (
        <Button
          type="button"
          key={action.action}
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => {
            handleAction(action.action);
          }}
        >
          <action.icon className="size-4" />
          {action.label}
        </Button>
      ))}

      <Button
        variant="ghost"
        className="hover:bg-destructive/10 hover:text-destructive"
        onClick={() => handleAction("delete")}
      >
        <Trash2 /> Delete
      </Button>

      <CustomerInviteStatusDialog
        id={id}
        variant={variant as any}
        showDialog={openDialog}
        setShowDialog={setOpenDialog}
      />
    </PopoverXDrawer>
  );
};
