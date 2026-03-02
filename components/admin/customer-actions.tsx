"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { statusMap } from "@/lib/constants/customer";
import { PopoverXDrawer } from "../popover-x-drawer";
import { Eye, FileText, MoreVertical, Trash2 } from "lucide-react";
import { CustomerStatusDialog } from "./customer-status-dialog";
import { deleteCustomer, updateCustomer } from "@/server/customer";

type Status = keyof typeof statusMap;

interface Props {
  status: Status;
  id: number;
  showView?: boolean;
}
export const CustomerAction = ({ id, status, showView = true }: Props) => {
  const [open, setOpen] = useState(false);
  const confirm = useConfirm();

  const [statusVariant, setStatusVariant] = useState("reject");
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const availableActions = statusMap[status].actions;

  const handleAction = (action: string) => {
    switch (action) {
      case "active":
        confirm.info({
          title: "Approve Application",
          description:
            "Approving this application will activate the customer account and send a notification to the customer.",
          actionLabel: "Yes, Approve",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await updateCustomer(id, {
              status: "active",
            });

            if (success) toast.success("Application has been approved");
            else toast.error(error.message);
          },
        });

        break;

      case "under_review":
        confirm.info({
          title: "Move to Review?",
          description:
            "This will move the application back to the review stage and update its status to 'Under Review'.",
          actionLabel: "Yes, Move",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await updateCustomer(id, {
              status: "under_review",
            });

            if (success) toast.success("Application moved to review!");
            else toast.error(error.message);
          },
        });

        break;
      case "on_hold":
        setStatusVariant("hold");
        setShowStatusDialog(true);
        break;
      case "rejected":
        setStatusVariant("reject");
        setShowStatusDialog(true);
        break;
      case "delete":
        confirm.delete({
          title: "Delete Application",
          description:
            "This action will permanently remove the application and this cannot be undone.",
          actionLabel: "Yes, Delete",
          action: async () => {
            const { success, error } = await deleteCustomer(id);

            if (success) toast.success("Application has been deleted.");
            else toast.error(error.message);
          },
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
