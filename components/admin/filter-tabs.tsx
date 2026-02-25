"use client";
import Link from "next/link";
import { SIDEBAR_MENU } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { useStatusCount } from "@/hooks/use-status-count";

interface FilterProps {
  tabs: (typeof SIDEBAR_MENU)[number]["items"];
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
      className="relative shrink-0 flex items-start gap-4 overflow-x-auto no-scrollbar
      after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-border"
    >
      {tabs.map((item) => {
        const value = item.query.status;
        return (
          <Link
            key={value}
            href={`?${value ? `status=${value}` : ""}`}
            data-active={activeStatus === value || (!value && !activeStatus)}
            className="relative h-9 inline-flex items-start gap-2 font-medium
            border-b-2 border-transparent z-1 leading-tight
            data-[active=true]:border-black hover:border-black transition whitespace-nowrap"
            style={{ "--color": item.color } as React.CSSProperties}
          >
            {item.label}
            {isPending ? (
              <Skeleton className="size-6 rounded-xl" />
            ) : (
              <Badge
                variant="outline"
                className="min-w-6 border-(--color)/10 bg-(--color)/10 text-(--color) rounded-xl px-1 text-xs"
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

const FilterTabsFallback = () => {
  return (
    <div className="pb-3 border-b-2 flex gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-6 w-14 rounded-xl" />
      ))}
    </div>
  );
};
