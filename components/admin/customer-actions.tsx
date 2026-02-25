"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { statusMap } from "@/lib/constants/customer";
import { PopoverXDrawer } from "../popover-x-drawer";
import { Eye, FileText, Mail, MoreVertical, Trash2 } from "lucide-react";
import { CustomerStatusDialog } from "./customer-status-dialog";
import { useUpdateCustomer, useDeleteCustomer } from "@/hooks/use-customer";

type Status = keyof typeof statusMap;

interface Props {
  status: Status;
  id: number;
  showView?: boolean;
}
export const CustomerAction = ({ id, status, showView = true }: Props) => {
  const [open, setOpen] = useState(false);
  const confirm = useConfirm();
  const { mutate: accept } = useUpdateCustomer();
  const { mutate: remove } = useDeleteCustomer();

  const [statusVariant, setStatusVariant] = useState("reject");
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const availableActions = statusMap[status].actions;

  const handleAction = (action: string) => {
    switch (action) {
      case "rejected":
        setStatusVariant("reject");
        setShowStatusDialog(true);
        break;
      case "active":
        confirm.info({
          title: "Accept Application",
          description:
            "Approving this application will activate the customer account and send a notification to the customer.",
          actionLabel: "Yes, Accept",
          cancelLabel: "Cancel",
          action: () =>
            new Promise((res) =>
              accept(
                { id, status: "active" },
                {
                  onError: (e) => toast.error(e.message),
                  onSuccess: (res) =>
                    toast.success("Application has been accepted."),
                  onSettled: () => res(),
                }
              )
            ),
        });

        break;

      case "new":
        confirm.info({
          title: "Move to Review?",
          description:
            "This will move the application back to the review stage and update its status to 'New'. You can continue reviewing and make changes before approval.",
          actionLabel: "Yes, Move",
          cancelLabel: "Cancel",
          action: () =>
            new Promise((res) =>
              accept(
                { id, status: "new" },
                {
                  onError: (e) => toast.error(e.message),
                  onSuccess: (res) =>
                    toast.success("Application moved to review!"),
                  onSettled: () => res(),
                }
              )
            ),
        });

        break;
      case "on_hold":
        setStatusVariant("hold");
        setShowStatusDialog(true);
        break;
      case "delete":
        confirm.delete({
          title: "Delete Application",
          description:
            "This action will permanently remove the application and this cannot be undone.",
          actionLabel: "Yes, Delete",
          action: () =>
            new Promise((res) =>
              remove(id, {
                onError: (e) => toast.error(e.message),
                onSuccess: (res) =>
                  toast.success("Application has been deleted."),
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

      <Button variant="ghost" onClick={() => handleAction("send-pdf")}>
        <Mail /> Send PDF
      </Button>
      <Button variant="ghost" asChild>
        <a href={`/api/customers/${id}/pdf`} target="_blank">
          <FileText /> Download PDF
        </a>
      </Button>

      <Button
        variant="ghost"
        className="hover:bg-destructive/10 hover:text-destructive"
        onClick={() => handleAction("delete")}
      >
        <Trash2 /> Delete
      </Button>

      {/* status dialog */}
      <CustomerStatusDialog
        variant={statusVariant as any}
        showDialog={showStatusDialog}
        setShowDialog={setShowStatusDialog}
        id={id}
      />
    </PopoverXDrawer>
  );
};
