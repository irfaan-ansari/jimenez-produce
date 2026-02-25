"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";

import { PopoverXDrawer } from "../popover-x-drawer";
import { Eye, MoreVertical, SquarePen, Trash2 } from "lucide-react";

import {
  useDeleteJobPost,
  useUpdateJobPost,
} from "@/hooks/use-job-application";
import { JobPostDialog } from "./job-post-dialog";
import { JobPostSelectType } from "@/lib/db/schema";
import { jobPostStatusMap } from "@/lib/constants/job";

type Status = keyof typeof jobPostStatusMap;

interface Props {
  post: Omit<JobPostSelectType, "status"> & {
    status: Status;
  };
  showView: boolean;
}
export const JobPostAction = ({ post, showView = true }: Props) => {
  const { id, status } = post;
  const [open, setOpen] = useState(false);
  const confirm = useConfirm();

  const { mutate: update } = useUpdateJobPost();
  const { mutate: remove } = useDeleteJobPost();

  const [showDialog, setShowDialog] = useState(false);

  const availableActions = jobPostStatusMap[status].actions;

  const handleAction = (action: string) => {
    switch (action) {
      case "edit":
        setShowDialog(true);
        break;

      case "draft":
        confirm.info({
          title: "Move to Draft",
          description:
            "This will unpublish the job post and move it back to draft. It will no longer be visible to applicants.",
          actionLabel: "Yes, Move to Draft",
          cancelLabel: "Cancel",
          action: () =>
            new Promise((res) =>
              update(
                { id, status: "draft" },
                {
                  onError: (e) => toast.error(e.message),
                  onSuccess: () => toast.success("Job post moved to draft."),
                  onSettled: () => res(),
                }
              )
            ),
        });
        break;

      case "published":
        confirm.info({
          title: "Publish Job Post",
          description:
            "This will publish the job post and make it visible to applicants.",
          actionLabel: "Yes, Publish",
          cancelLabel: "Cancel",
          action: () =>
            new Promise((res) =>
              update(
                { id, status: "published" },
                {
                  onError: (e) => toast.error(e.message),
                  onSuccess: () =>
                    toast.success("Job post published successfully."),
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
          onClick={() => handleAction("view")}
        >
          <Eye />
          View
        </Button>
      )}

      <Button
        type="button"
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => handleAction("edit")}
      >
        <SquarePen />
        Edit
      </Button>

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

      {/* view edit  dialog */}

      <JobPostDialog
        openDialog={showDialog}
        setOpenDialog={setShowDialog}
        post={post}
      />
    </PopoverXDrawer>
  );
};
