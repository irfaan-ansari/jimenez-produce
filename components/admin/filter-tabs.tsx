"use client";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { useCountsByStatus } from "@/hooks/use-status-count";

interface FilterTabProps {
  tabs: { label: string; value: string }[];
  path: string;
}

export const FilterTab = ({ tabs, path }: FilterTabProps) => {
  const { searchParamsObj } = useRouterStuff();

  const { data, isPending } = useCountsByStatus(path);

  const activeStatus =
    typeof searchParamsObj.status === "string"
      ? searchParamsObj.status
      : undefined;

  return (
    <div className="relative no-scrollbar flex shrink-0 items-start gap-2.5 overflow-x-auto">
      {tabs.map(({ label, value }, i) => {
        const map = STATUS_MAP[(value || "all") as keyof typeof STATUS_MAP];

        return (
          <Link
            key={value + i}
            href={`?${value ? `status=${value}` : ""}`}
            data-active={activeStatus === value || (!value && !activeStatus)}
            className="relative z-1 inline-flex h-8 items-center gap-2 rounded-xl border bg-background pr-1.5 pl-3
            text-sm leading-tight font-medium whitespace-nowrap transition hover:bg-foreground hover:text-muted data-active:border-black data-active:bg-foreground data-active:text-muted"
            style={{ "--color": map.color } as React.CSSProperties}
          >
            {label}
            {isPending ? (
              <Skeleton className="size-6 rounded-xl" />
            ) : (
              <Badge
                variant="outline"
                className="min-w-6 rounded-xl border-(--color)/10 bg-(--color)/10 px-1 text-xs text-(--color)"
              >
                {data?.data?.[value || "all"] ?? 0}
              </Badge>
            )}
          </Link>
        );
      })}
    </div>
  );
};
