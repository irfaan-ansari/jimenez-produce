"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { CustomerDialog } from "./customer-dialog";
import { CustomerSelectType } from "@/lib/db/schema";
import { PopoverXDrawer } from "../popover-x-drawer";
import { useQueryClient } from "@tanstack/react-query";
import { CustomerStatusDialog } from "./customer-status-dialog";
import { deleteCustomer, updateCustomer } from "@/server/customer";
import { Eye, FileText, MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { CustomerApproveDialog } from "./customer-approve-dialog";
import { CUSTOMER_ACTIONS } from "@/lib/constants/status-map";

type Status = keyof typeof CUSTOMER_ACTIONS;

interface Props {
  data: CustomerSelectType;
  showView?: boolean;
}
export const CustomerAction = ({ data, showView = true }: Props) => {
  const { status, id } = data as { status: Status; id: number };
  const [open, setOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [statusVariant, setStatusVariant] = useState("rejected");
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const availableActions = CUSTOMER_ACTIONS[status] ?? [];

  const handleAction = (action: string) => {
    switch (action) {
      case "active":
        setApproveOpen(true);
        break;

      case "under_review":
        confirm.info({
          title: "Move to Review?",
          description:
            "This will move the application to review stage and update its status to 'Under Review'.",
          actionLabel: "Yes, Move",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await updateCustomer(id, {
              status: "under_review",
            });

            if (success) {
              queryClient.invalidateQueries({ queryKey: ["customers"] });
              toast.success("Application moved to review!");
            } else toast.error(error.message);
          },
        });

        break;
      case "on_hold":
      case "rejected":
        setStatusVariant(action);
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

            if (success) {
              queryClient.invalidateQueries({ queryKey: ["customers"] });
              toast.success("Application has been deleted.");
            } else toast.error(error.message);
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
      <CustomerDialog initialValues={data} id={id}>
        <Button
          type="button"
          variant="ghost"
          className="flex items-center justify-start gap-2"
        >
          <SquarePen />
          Edit
        </Button>
      </CustomerDialog>

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
      {/* customer approve dialog */}
      <CustomerApproveDialog
        open={approveOpen}
        setOpen={setApproveOpen}
        action={async (locationId) => {
          const { success, error } = await updateCustomer(id, {
            status: "active",
            locationId,
          });

          if (success) {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            toast.success("Application has been approved");
            setApproveOpen(false);
          } else toast.error(error.message);
        }}
      />
    </PopoverXDrawer>
  );
};
