"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CustomerForm } from "../customer-form/form";

export const CustomerDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Customer
          </DialogTitle>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[min(440px,60vh)] -my-1 py-1  overflow-y-auto px-4">
          <CustomerForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};
