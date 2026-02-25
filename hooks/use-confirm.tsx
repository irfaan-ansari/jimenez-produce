"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";

type Variant = "success" | "error" | "warning" | "info" | "delete";

type ConfirmOptions = {
  title: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
  action?: () => Promise<void> | void;
};

type ConfirmMethod = (options: ConfirmOptions) => Promise<boolean>;

type ConfirmContextType = {
  success: ConfirmMethod;
  error: ConfirmMethod;
  warning: ConfirmMethod;
  info: ConfirmMethod;
  delete: ConfirmMethod;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<Variant>("info");
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<(value: boolean) => void>();
  const [loading, setLoading] = useState(false);

  const openDialog = useCallback(
    (variant: Variant, options: ConfirmOptions) => {
      setVariant(variant);
      setOptions(options);
      setOpen(true);

      return new Promise<boolean>((resolve) => {
        setResolver(() => resolve);
      });
    },
    []
  );

  const handleConfirm = async () => {
    if (!options?.action) {
      resolver?.(true);
      setOpen(false);
      return;
    }

    try {
      setLoading(true);
      await options.action();
      resolver?.(true);
      setOpen(false);
    } catch (err) {
      console.error(err);
      resolver?.(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      resolver?.(false);
      setOpen(false);
    }
  };

  const value = useMemo<ConfirmContextType>(
    () => ({
      success: (options) => openDialog("success", options),
      error: (options) => openDialog("error", options),
      warning: (options) => openDialog("warning", options),
      info: (options) => openDialog("info", options),
      delete: (options) => openDialog("delete", options),
    }),
    [openDialog]
  );

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {options && (
        <ConfirmDialog
          open={open}
          setOpen={() => handleCancel()}
          variant={variant}
          title={options.title}
          description={options.description}
          actionLabel={options.actionLabel}
          cancelLabel={options.cancelLabel}
          onAction={handleConfirm}
          loading={loading}
        />
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used inside ConfirmProvider");
  }
  return context;
};
