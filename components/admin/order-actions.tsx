"use client";

import {
  Eye,
  Trash2,
  Package,
  SquarePen,
  FileCheck,
  CheckCircle,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { OrderType } from "@/lib/types";
import { useConfirm } from "@/hooks/use-confirm";
import { PopoverXDrawer } from "../popover-x-drawer";
import { useQueryClient } from "@tanstack/react-query";
import { deleteOrder, updateOrder } from "@/server/order";
import { OrderScheduleDialog } from "./order-schedule-dialog";

export const OrderActions = ({
  showView,
  data,
}: {
  data: OrderType;
  showView?: boolean;
}) => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { id, deliveryDate, deliveryWindow, status } = data;

  const handleAction = (action: string) => {
    switch (action) {
      case "completed":
        confirm.warning({
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
          <Link href={`/admin/orders/${id}`}>
            <Eye />
            View
          </Link>
        </Button>
      )}

      {status !== "completed" && (
        <OrderScheduleDialog
          defaultValues={{ id, deliveryDate, deliveryWindow }}
        >
          <Button variant="ghost" className="justify-start rounded-xl">
            <SquarePen /> Edit Schedule
          </Button>
        </OrderScheduleDialog>
      )}

      {status !== "completed" && (
        <Button variant="ghost" onClick={() => handleAction("completed")}>
          <CheckCircle /> Mark as Completed
        </Button>
      )}

      <Button variant="ghost" asChild>
        <a href={`/api/orders/${id}/invoice`} target="_blank">
          <FileCheck /> Invoice
        </a>
      </Button>
      <Button variant="ghost" asChild>
        <a href={`/api/orders/${id}/packing-slip`} target="_blank">
          <Package /> Packing Slip
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
