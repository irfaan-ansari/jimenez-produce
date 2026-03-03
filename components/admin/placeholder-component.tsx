import { AlertTriangle, Inbox, Loader } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

export const EmptyComponent = ({
  title = "No Data Available",
  description = "There’s currently nothing to display here.",
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
          <AlertTriangle className="size-10 text-destructive" />
        )}

        <EmptyTitle className="text-xl font-semibold">{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export const LoadingSkeleton = () => {
  return (
    <Empty className="border border-dashed rounded-2xl bg-sidebar">
      <EmptyHeader>
        <EmptyMedia>
          <Loader className="animate-spin" />
        </EmptyMedia>

        <EmptyDescription>Loading please wait...</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
