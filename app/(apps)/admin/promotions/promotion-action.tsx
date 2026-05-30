"use client";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import PromotionDialog from "./promotion-dialog";
import { deletePromotion } from "@/server/promotion";
import { useQueryClient } from "@tanstack/react-query";
import { PromotionTypeWithTeam } from "@/hooks/data/promotions";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";

export const PromotionAction = ({ data }: { data: PromotionTypeWithTeam }) => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    confirm.delete({
      title: "",
      description: "",
      action: async () => {
        const toastId = toast.loading("Please wait...");
        const { success, error } = await deletePromotion(data.id);
        if (success) {
          toast.success("Deleted", { id: toastId });
          queryClient.invalidateQueries({
            queryKey: ["promotions"],
          });
          setOpen(false);
        } else {
          toast.error(error.message, { id: toastId });
        }
      },
    });
  };

  return (
    <PopoverXDrawer
      open={open}
      setOpen={setOpen}
      className="w-40"
      trigger={
        <Button size="icon-sm" variant="outline">
          <MoreVertical className="size-5" />
        </Button>
      }
    >
      <PromotionDialog
        initialData={{
          ...data,
          name: data.name ?? "",
          title: data.title ?? "",
          description: data.description ?? "",
          badge: data?.badge ?? "",
          media: data?.media ?? "",
          teams:
            data.teams.map((t) => ({
              teamId: t.id,
              name: t.name,
              phone: t.phone,
              email: t.email,
            })) ?? [],
        }}
      >
        <Button variant="ghost" className="justify-start rounded-lg!">
          <SquarePen /> Edit
        </Button>
      </PromotionDialog>
      <Button
        variant="destructive"
        onClick={handleDelete}
        className="rounded-lg! bg-transparent"
      >
        <Trash2 /> Delete
      </Button>
    </PopoverXDrawer>
  );
};
