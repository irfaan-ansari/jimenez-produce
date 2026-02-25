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
      <AlertDialogContent className="py-12 sm:px-8 ring-ring/10 rounded-2xl data-[size=default]:sm:max-w-md">
        <div className="flex flex-col gap-6 text-center items-center">
          <span
            className={cn(
              "inline-flex justify-center items-center size-14 rounded-2xl mb-4",
              config.iconClass
            )}
          >
            <config.icon className="size-7" />
          </span>

          <div className="space-y-2">
            <AlertDialogTitle className="text-xl font-semibold">
              {title}
            </AlertDialogTitle>

            {description && (
              <AlertDialogDescription className="text-base">
                {description}
              </AlertDialogDescription>
            )}
          </div>

          {children}

          <AlertDialogFooter className="flex gap-4 sm:[&_button]:flex-1 w-full sm:justify-between">
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
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
