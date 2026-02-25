"use client";

import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "./ui/popover";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";

interface Props {
  title?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export const PopoverXDrawer = ({
  title,
  trigger,
  children,
  className,
  open,
  setOpen,
}: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className={cn("p-2 pt-0", className)}>
          <DrawerTitle className={!title ? "sr-only" : ""}>
            {title ?? "Popover"}
          </DrawerTitle>
          <div className="flex flex-col gap-0.5 justify-start **:data-[slot=button]:justify-start **:data-[slot=button]:rounded-xl mt-4">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className={cn(
          "max-w-40 rounded-2xl p-2 **:data-[slot=button]:justify-start **:data-[slot=button]:rounded-xl data-[slot=popover-content]:max-w-52",
          className
        )}
        align="end"
      >
        <PopoverTitle className={!title ? "sr-only" : ""}>
          {title ?? "Popover"}
        </PopoverTitle>

        <div className="flex flex-col gap-0.5 justify-start">{children}</div>
      </PopoverContent>
    </Popover>
  );
};
