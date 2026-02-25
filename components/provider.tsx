"use client";
import React from "react";
import { Toaster } from "./ui/sonner";
import { TooltipProvider } from "./ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmProvider } from "@/hooks/use-confirm";

const queryClient = new QueryClient();
export const Provider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </TooltipProvider>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
};
