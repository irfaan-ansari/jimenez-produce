"use client";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { useStatusCount } from "@/hooks/use-status-count";
import { STATUS_MAP } from "@/lib/constants/status-map";

interface FilterProps {
  tabs: { label: string; value: string }[];
  queryKey: string;
}

export const FilterTabs = ({ tabs, queryKey }: FilterProps) => {
  const { searchParamsObj } = useRouterStuff();

  const { data, isPending } = useStatusCount(queryKey);

  const activeStatus =
    typeof searchParamsObj.status === "string"
      ? searchParamsObj.status
      : undefined;

  return (
    <div
      className="relative no-scrollbar flex shrink-0 items-start gap-4 overflow-x-auto
      after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-border"
    >
      {tabs.map(({ label, value }, i) => {
        const map = STATUS_MAP[(value || "all") as keyof typeof STATUS_MAP];

        return (
          <Link
            key={value + i}
            href={`?${value ? `status=${value}` : ""}`}
            data-active={activeStatus === value || (!value && !activeStatus)}
            className="relative z-1 inline-flex h-9 items-start gap-2
            border-b-2 border-transparent leading-tight font-medium
            whitespace-nowrap transition hover:border-black data-[active=true]:border-black"
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
