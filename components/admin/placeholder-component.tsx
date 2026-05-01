"use client";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Loader } from "../animate-ui/icons/loader";
import { Inbox, OctagonX } from "lucide-react";
import { AnimateIcon } from "../animate-ui/icons/icon";
import { cn } from "@/lib/utils";

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
      <Empty>
        <EmptyHeader className="rounded-2xl border bg-sidebar p-10 shadow-xs">
          <EmptyMedia>
            <AnimateIcon animate persistOnAnimateEnd>
              <Loader />
            </AnimateIcon>
          </EmptyMedia>
          <EmptyDescription>Please wait...</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
};
