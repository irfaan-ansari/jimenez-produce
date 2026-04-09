"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { deleteProduct } from "@/server/product";
import { ProductDialog } from "./product-dialog";
import { useConfirm } from "@/hooks/use-confirm";
import { type AdminProductType } from "@/lib/types";
import { PopoverXDrawer } from "../popover-x-drawer";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";

export const ProductAction = ({ product }: { product: AdminProductType }) => {
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);

  const handleAction = () => {
    confirm.delete({
      title: "Delete Product",
      description:
        "This action will permanently delete the selected product and this cannot be undone.",
      actionLabel: "Yes, Delete",
      action: async () => {
        const { success, error } = await deleteProduct(product.id);
        if (success) {
          toast.success("Product has been deleted!");
          setOpen(false);
        } else {
          toast.error(error.message);
        }
      },
      cancelLabel: "Cancel",
    });
  };

  return (
    <PopoverXDrawer
      open={open}
      setOpen={setOpen}
      trigger={
        <Button
          size="icon-sm"
          variant="outline"
          className="rounded-xl absolute right-2 top-2 z-2"
        >
          <MoreVertical className="size-5" />
        </Button>
      }
    >
      <ProductDialog
        trigger={
          <Button variant="ghost" className="justify-start">
            <SquarePen /> Edit
          </Button>
        }
        product={product}
      />

      <Button
        variant="ghost"
        className="hover:bg-destructive/10 hover:text-destructive"
        onClick={() => handleAction()}
      >
        <Trash2 /> Delete
      </Button>
    </PopoverXDrawer>
  );
};
