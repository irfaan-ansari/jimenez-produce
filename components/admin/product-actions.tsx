"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { ProductDialog } from "./product-dialog";
import { ProductSelectType } from "@/lib/db/schema";
import { PopoverXDrawer } from "../popover-x-drawer";
import { useDeleteProduct } from "@/hooks/use-product";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";

export const ProductAction = ({ product }: { product: ProductSelectType }) => {
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const { mutate } = useDeleteProduct();

  const handleAction = () => {
    confirm.delete({
      title: "Delete Product",
      description:
        "This action will permanently delete the selected product and this cannot be undone.",
      actionLabel: "Yes, Delete",
      action: async () =>
        await new Promise((res) => {
          mutate(product.id, {
            onError: (err) => {
              toast.error(err.message);
            },
            onSuccess: () => {
              toast.success("Product has been deleted!");
              setOpen(false);
            },
            onSettled: () => res(),
          });
        }),
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
