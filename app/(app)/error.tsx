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
    <div className="flex flex-col h-svh items-center justify-center">
      <Empty className="border max-h-72 border-solid max-w-md rounded-2xl shadow-xs bg-sidebar p-6">
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
            className="rounded-xl px-6"
            size="lg"
            onClick={() => reset()}
          >
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
