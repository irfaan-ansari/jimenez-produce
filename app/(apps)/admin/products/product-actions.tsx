"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/server/product";
import { ProductDialog } from "@/components/admin/product-dialog";
import { useConfirm } from "@/hooks/use-confirm";
import { type AdminProductType } from "@/lib/types";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export const ProductAction = ({ product }: { product: AdminProductType }) => {
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
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
          queryClient.invalidateQueries({
            queryKey: ["products"],
          });
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
          className="absolute top-2 right-2 z-2 rounded-xl"
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
