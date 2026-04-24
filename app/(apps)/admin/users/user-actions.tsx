"use client";
import React from "react";
import { Member } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PopoverXDrawer } from "@/components/popover-x-drawer";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";

export const UserAction = ({ data }: { data: Member }) => {
  const [open, setOpen] = React.useState(false);
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
      <Button variant="ghost" className="rounded-lg!">
        <SquarePen /> Edit Role
      </Button>
      <Button variant="destructive" className="rounded-lg!">
        <Trash2 /> Delete
      </Button>
    </PopoverXDrawer>
  );
};
