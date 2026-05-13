"use client";

import { cn } from "@/lib/utils";
import { Inbox, OctagonX } from "lucide-react";
import { Loader } from "../animate-ui/icons/loader";
import { AnimateIcon } from "../animate-ui/icons/icon";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "../ui/empty";

export const EmptyComponent = ({
  title = "No Data Available",
  description = "Requested resource not found",
  variant = "empty",
}: {
  title?: string;
  description?: string;
  variant: "error" | "empty";
}) => {
  return (
    <Empty>
      <EmptyHeader>
        {variant === "empty" ? (
          <Inbox className="size-20 text-neutral-200" />
        ) : (
          <OctagonX className="size-20 text-neutral-200" />
        )}

        <EmptyTitle className="text-xl font-semibold">{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export const LoadingSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <AnimateIcon animate={true} persistOnAnimateEnd animateOnView>
        <Loader className="size-6" />
      </AnimateIcon>
    </div>
  );
};
