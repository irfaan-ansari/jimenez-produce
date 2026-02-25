"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";

import { PopoverXDrawer } from "../popover-x-drawer";
import { Eye, MoreVertical, Trash2 } from "lucide-react";

import {
  useDeleteJobApplication,
  useUpdateJobApplication,
} from "@/hooks/use-job-application";
import { JobApplicationStatusDialog } from "./job-application-status-dialog";
import { jobApplicationStatusMap } from "@/lib/constants/job";

type Status = keyof typeof jobApplicationStatusMap;

interface Props {
  status: Status;
  id: number;
  showView: boolean;
}
export const JobApplicationAction = ({
  id,
  status,
  showView = true,
}: Props) => {
  const [open, setOpen] = useState(false);
  const confirm = useConfirm();

  const { mutate: accept } = useUpdateJobApplication();
  const { mutate: remove } = useDeleteJobApplication();
  const [statusVariant, setStatusVariant] = useState("reject");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const availableActions = jobApplicationStatusMap[status].actions;

  const handleAction = (action: string) => {
    switch (action) {
      case "rejected":
        setStatusVariant("reject");
        setShowRejectDialog(true);
        break;
      case "interview":
        setStatusVariant("interview");
        setShowRejectDialog(true);
        break;
      case "pending":
        confirm.info({
          title: "Send Agreement",
          description:
            "This will send the agreement to the applicant for review and signature.",
          actionLabel: "Yes, Send",
          cancelLabel: "Cancel",
          action: () =>
            new Promise((res) =>
              accept(
                { id, status: "pending" },
                {
                  onError: (e) => toast.error(e.message),
                  onSuccess: (res) =>
                    toast.success("Agreement sent successfully."),
                  onSettled: () => res(),
                }
              )
            ),
        });
        break;
      case "hired":
        confirm.info({
          title: "Mark as Hired",
          description:
            "This will update the applicant's status to Hired and send a welcome onboarding email.",
          actionLabel: "Yes, Send",
          cancelLabel: "Cancel",
          action: () =>
            new Promise((res) =>
              accept(
                { id, status: "hired" },
                {
                  onError: (e) => toast.error(e.message),
                  onSuccess: (res) =>
                    toast.success("Applicant marked as hired."),
                  onSettled: () => res(),
                }
              )
            ),
        });
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
          <Link href={`/admin/job-applications/${id}`}>
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

      <Button
        variant="ghost"
        className="hover:bg-destructive/10 hover:text-destructive"
        onClick={() => handleAction("delete")}
      >
        <Trash2 /> Delete
      </Button>

      {/* reject dialog */}
      <JobApplicationStatusDialog
        variant={statusVariant as any}
        showDialog={showRejectDialog}
        setShowDialog={setShowRejectDialog}
        id={id}
      />
    </PopoverXDrawer>
  );
};
