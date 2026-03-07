"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { PenSquare } from "lucide-react";

export const UploadJobDocuments = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="rounded-xl ml-auto">
          <PenSquare />
        </Button>
      </DialogTrigger>
      <DialogContent className="ring-ring/10 rounded-2xl sm:max-w-lg py-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Upload Documents
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
