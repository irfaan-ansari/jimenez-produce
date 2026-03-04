"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Empty className="border border-dashed rounded-2xl h-full bg-neutral-50">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="rounded-xl size-14 text-destructive bg-destructive/10"
        >
          <AlertTriangle />
        </EmptyMedia>
        <EmptyTitle>{error.name ?? "Internal server error"}</EmptyTitle>
        <EmptyDescription>
          {error.message || "Something went wrong, please try again."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant="outline"
          className="rounded-xl"
          size="lg"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  );
}
