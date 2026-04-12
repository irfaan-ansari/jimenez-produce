"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { PopoverXDrawer } from "../popover-x-drawer";
import { useQueryClient } from "@tanstack/react-query";
import { deleteOrder, updateOrder } from "@/server/order";
import { CheckCircle, Eye, FileText, MoreVertical, Trash2 } from "lucide-react";

export const OrderActions = ({
  id,
  showView = true,
}: {
  id: number;
  showView?: boolean;
}) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const confirm = useConfirm();

  const handleAction = (action: string) => {
    switch (action) {
      case "completed":
        confirm.info({
          title: "Mark as Completed",
          description: "This will mark the order as delivered to the customer.",
          actionLabel: "Yes",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await updateOrder(id, {
              status: "completed",
            });

            if (success) {
              toast.success("Order completed successfully.");
              queryClient.invalidateQueries({ queryKey: ["orders"] });
            } else toast.error(error.message);
          },
        });
        break;

      case "delete":
        confirm.delete({
          title: "Delete Order",
          description:
            "This action will permanently remove the order and this cannot be undone.",
          actionLabel: "Yes, Delete",
          action: async () => {
            const { success, error } = await deleteOrder(id);
            if (success) {
              toast.success("Order deleted successfully.");
              queryClient.invalidateQueries({ queryKey: ["orders"] });
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
          <Link href={`/admin/orders/${id}`}>
            <Eye />
            View
          </Link>
        </Button>
      )}

      <Button variant="ghost" onClick={() => handleAction("completed")}>
        <CheckCircle /> Mark as Completed
      </Button>

      <Button variant="ghost" asChild>
        <a href={`/api/orders/${id}/pdf`} target="_blank">
          <FileText /> Download Invoice
        </a>
      </Button>

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
