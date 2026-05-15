import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "./ui/alert-dialog";
import {
  CircleCheck,
  TriangleAlert,
  CircleX,
  Info,
  Trash2,
  LucideIcon,
  Loader,
} from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "success" | "error" | "warning" | "info" | "delete";

const VARIANT_CONFIG: Record<
  Variant,
  {
    icon: LucideIcon;
    iconClass: string;
  }
> = {
  success: {
    icon: CircleCheck,
    iconClass: "bg-green-500/10 text-green-600 ring-green-500/20",
  },
  error: {
    icon: CircleX,
    iconClass: "bg-red-500/10 text-red-600 ring-red-500/20",
  },
  warning: {
    icon: TriangleAlert,
    iconClass: "bg-yellow-500/10 text-yellow-600 ring-yellow-500/20",
  },
  info: {
    icon: Info,
    iconClass: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
  },
  delete: {
    icon: Trash2,
    iconClass: "bg-red-500/10 text-red-600 ring-red-500/20",
  },
};

type ConfirmDialogProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  variant?: Variant;
  title: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
  onAction?: () => void;
  loading?: boolean;
  children?: ReactNode;
};

export const ConfirmDialog = ({
  open,
  setOpen,
  variant = "info",
  title,
  description,
  actionLabel = "Confirm",
  cancelLabel = "Cancel",
  onAction,
  loading,
  children,
}: ConfirmDialogProps) => {
  const config = VARIANT_CONFIG[variant];

  return (
    <AlertDialog
      open={open}
      onOpenChange={(v) => {
        if (!loading) setOpen(v);
      }}
    >
      <AlertDialogContent className="rounded-2xl py-8 ring-ring/10 sm:px-8 data-[size=default]:sm:max-w-md">
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            className={cn(
              "inline-flex size-12 items-center justify-center rounded-xl",
              config.iconClass,
            )}
          >
            <config.icon className="size-5" />
          </span>

          <div className="space-y-1.5">
            <AlertDialogTitle className="text-xl font-semibold">
              {title}
            </AlertDialogTitle>

            {description && (
              <AlertDialogDescription className="text-sm">
                {description}
              </AlertDialogDescription>
            )}
          </div>

          {children}
        </div>
        <AlertDialogFooter className="mt-6 flex w-full gap-4 sm:justify-between sm:[&_button]:flex-1">
          <AlertDialogCancel className="rounded-xl" size="xl">
            {cancelLabel}
          </AlertDialogCancel>

          {onAction && (
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onAction?.();
              }}
              className="rounded-xl"
              size="xl"
              disabled={loading}
              variant={variant === "delete" ? "destructive" : "default"}
            >
              {loading ? <Loader className=" animate-spin" /> : actionLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
