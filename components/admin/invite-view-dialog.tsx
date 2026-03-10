"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export const InviteViewDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="ring-ring/10 rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">View</DialogTitle>
        </DialogHeader>

        <div className="no-scrollbar -mx-4 max-h-[min(440px,60vh)] -my-1 py-1  overflow-y-auto px-4">
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-xl font-semibold col-span-3">Applicant:</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
