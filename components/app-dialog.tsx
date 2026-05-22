"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface BaseProps {
  children: React.ReactNode;
}

interface RootAppDialogProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface AppDialogProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const AppDialogContext = React.createContext<{ isMobile: boolean }>({
  isMobile: false,
});

const useAppDialogContext = () => {
  const context = React.useContext(AppDialogContext);
  if (!context) {
    throw new Error(
      "AppDialog components cannot be rendered outside the AppDialog Context",
    );
  }
  return context;
};

const AppDialog = ({ children, ...props }: RootAppDialogProps) => {
  const isMobile = useIsMobile();
  const AppDialog = isMobile ? Drawer : Dialog;

  return (
    <AppDialogContext.Provider value={{ isMobile }}>
      <AppDialog {...props} {...(isMobile && { autoFocus: true })}>
        {children}
      </AppDialog>
    </AppDialogContext.Provider>
  );
};

const AppDialogTrigger = ({
  className,
  children,
  ...props
}: AppDialogProps) => {
  const { isMobile } = useAppDialogContext();
  const AppDialogTrigger = isMobile ? DrawerTrigger : DialogTrigger;

  return (
    <AppDialogTrigger className={className} {...props}>
      {children}
    </AppDialogTrigger>
  );
};

const AppDialogClose = ({ className, children, ...props }: AppDialogProps) => {
  const { isMobile } = useAppDialogContext();
  const AppDialogClose = isMobile ? DrawerClose : DialogClose;

  return (
    <AppDialogClose className={className} {...props}>
      {children}
    </AppDialogClose>
  );
};

const AppDialogContent = ({
  className,
  children,
  ...props
}: AppDialogProps) => {
  const { isMobile } = useAppDialogContext();
  const AppDialogContent = isMobile ? DrawerContent : DialogContent;

  return (
    <AppDialogContent
      className={cn(
        "flex flex-col data-[slot=drawer-content]:px-6 data-[slot=drawer-content]:pb-6 data-[vaul-drawer-direction=bottom]:max-h-[90vh] data-[vaul-drawer-direction=bottom]:rounded-b-none",
        className,
      )}
      {...props}
    >
      {children}
    </AppDialogContent>
  );
};

const AppDialogDescription = ({
  className,
  children,
  ...props
}: AppDialogProps) => {
  const { isMobile } = useAppDialogContext();
  const AppDialogDescription = isMobile ? DrawerDescription : DialogDescription;

  return (
    <AppDialogDescription className={className} {...props}>
      {children}
    </AppDialogDescription>
  );
};

const AppDialogHeader = ({ className, children, ...props }: AppDialogProps) => {
  const { isMobile } = useAppDialogContext();
  const AppDialogHeader = isMobile ? DrawerHeader : DialogHeader;

  return (
    <AppDialogHeader
      className={cn("data-[slot=drawer-header]:p-0 text-left!", className)}
      {...props}
    >
      {children}
    </AppDialogHeader>
  );
};

const AppDialogTitle = ({ className, children, ...props }: AppDialogProps) => {
  const { isMobile } = useAppDialogContext();
  const AppDialogTitle = isMobile ? DrawerTitle : DialogTitle;

  return (
    <AppDialogTitle className={className} {...props}>
      {children}
    </AppDialogTitle>
  );
};

const AppDialogFooter = ({ className, children, ...props }: AppDialogProps) => {
  const { isMobile } = useAppDialogContext();
  const AppDialogFooter = isMobile ? DrawerFooter : DialogFooter;

  return (
    <AppDialogFooter className={className} {...props}>
      {children}
    </AppDialogFooter>
  );
};

export {
  AppDialog,
  AppDialogTrigger,
  AppDialogClose,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogFooter,
};
