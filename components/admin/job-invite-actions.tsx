import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { PopoverXDrawer } from "../popover-x-drawer";
import { useQueryClient } from "@tanstack/react-query";
import { deleteInvite, updateInvite } from "@/server/job";
import { CheckCircle, MoreVertical, Trash2 } from "lucide-react";

interface Props {
  id: number;
  status: string;
}
export const JobInviteActions = ({ id, status }: Props) => {
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleAction = (action: string) => {
    switch (action) {
      // approve
      case "hired":
        confirm.info({
          title: "Are you sure?",
          description: "This will update the job invitation status to hired.",
          actionLabel: "Confirm",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await updateInvite(id, {
              status: "hired",
            });
            if (success) {
              queryClient.invalidateQueries({ queryKey: ["job-invites"] });
              toast.success("Marked as hired successfully.");
            } else {
              toast.error(error.message);
            }
          },
        });
        break;

      case "delete":
        confirm.delete({
          title: "Are you sure?",
          description:
            "This action will permanently remove the record and this cannot be undone.",
          actionLabel: "Yes, Delete",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await deleteInvite(id);
            if (success) {
              queryClient.invalidateQueries({ queryKey: ["job-invites"] });
              toast.success("Record deleted successfully");
            } else {
              toast.error(error.message);
            }
          },
        });
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
      {status !== "hired" && (
        <Button
          type="button"
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => {
            handleAction("hired");
          }}
        >
          <CheckCircle className="size-4" />
          Mark as hired
        </Button>
      )}

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
