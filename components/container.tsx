import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}
export const Container = ({ className, children }: Props) => {
  return (
    <div className={cn("max-w-7xl mx-auto px-5 md:px-8", className)}>
      {children}
    </div>
  );
};
