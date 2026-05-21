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
        <DrawerContent className={cn("px-4 pb-6 pt-0 justify-start", className)}>
          <DrawerTitle className='hidden'>
            {title ?? "Dropdown menu"}
          </DrawerTitle>

          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className={cn(
          "max-w-40 rounded-2xl flex flex-col p-2 gap-0 **:data-[slot=button]:justify-start **:data-[slot=button]:rounded-xl data-[slot=popover-content]:max-w-52",
          className,
        )}
        align="end"
      >
        <PopoverTitle className='hidden'>
          {title ?? "Popover"}
        </PopoverTitle>

        {children}
      </PopoverContent>
    </Popover>
  );
};
