"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { inviteStatusMap, statusMap } from "@/lib/constants/customer";
import { PopoverXDrawer } from "../popover-x-drawer";
import { MoreVertical, Trash2 } from "lucide-react";

import {
  useUpdateCustomer,
  useDeleteCustomer,
  useUpdateInvite,
  useDeleteInvite,
} from "@/hooks/use-customer";

type Status = keyof typeof inviteStatusMap;

interface Props {
  status: Status;
  id: number;
}
export const CustomerInviteAction = ({ id, status }: Props) => {
  const [open, setOpen] = useState(false);
  const confirm = useConfirm();
  const { mutate: accept } = useUpdateInvite();
  const { mutate: remove } = useDeleteInvite();

  const availableActions =
    inviteStatusMap[status as keyof typeof inviteStatusMap].actions;

  const handleAction = (action: string) => {
    switch (action) {
      case "invited":
        confirm.info({
          title: "Send Account Setup Invitation?",
          description:
            "This will mark the application as invited and send an account setup email to the applicant.",
          actionLabel: "Send Invitation",
          cancelLabel: "Cancel",
          action: () =>
            new Promise((res) =>
              accept(
                { id, status: "invited" },
                {
                  onError: (e) => toast.error(e.message),
                  onSuccess: () =>
                    toast.success("Invitation email sent successfully."),
                  onSettled: () => res(),
                }
              )
            ),
        });
        break;

      case "rejected":
        confirm.warning({
          title: "Reject Application?",
          description:
            "This will reject the application and send a notification email to the applicant.",
          actionLabel: "Yes, Reject",
          cancelLabel: "Cancel",
          action: () =>
            new Promise((res) =>
              accept(
                { id, status: "rejected" },
                {
                  onError: (e) => toast.error(e.message),
                  onSuccess: () =>
                    toast.success("Application rejected successfully."),
                  onSettled: () => res(),
                }
              )
            ),
        });
        break;
      case "converted":
        confirm.warning({
          title: "Convert to Customer?",
          description: "This will update the application status to converted.",
          actionLabel: "Mark as Converted",
          cancelLabel: "Cancel",
          action: () =>
            new Promise((res) =>
              accept(
                { id, status: "converted" },
                {
                  onError: (e) => toast.error(e.message),
                  onSuccess: () =>
                    toast.success("Application converted successfully."),
                  onSettled: () => res(),
                }
              )
            ),
        });
        break;

      case "delete":
        confirm.delete({
          title: "Permanently Delete This Application?",
          description:
            "This action will permanently remove the application and this cannot be undone.",
          actionLabel: "Yes, Delete",
          action: () =>
            new Promise((res) =>
              remove(id, {
                onError: (e) => toast.error(e.message),
                onSuccess: (res) =>
                  toast.success("Application deleted successfully."),
                onSettled: () => res(),
              })
            ),
          cancelLabel: "Cancel",
        });
        break;
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
    </PopoverXDrawer>
  );
};
