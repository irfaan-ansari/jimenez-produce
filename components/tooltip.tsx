import React from "react";
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip as TooltipRoot,
} from "@/components/ui/tooltip";

export const Tooltip = ({
  content,
  children,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </TooltipRoot>
  );
};
