"use client";

import Link from "next/link";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { SIDEBAR_MENU } from "@/lib/config";
import { useTabRouter } from "@/hooks/use-tab-router";
import { useProducts } from "@/hooks/use-product";

const TAB_OPTIONS =
  SIDEBAR_MENU.find((i) => i.href === "/admin/products")?.items ||
  SIDEBAR_MENU[0]["items"];

export const FilterTabs = () => {
  const { buildPath, isActive } = useTabRouter();
  return (
    <div className="after:inset-x-0 after:absolute after:bottom-0 after:bg-border after:h-0.5 relative flex gap-4 justify-start items-center overflow-scroll no-scrollbar">
      {TAB_OPTIONS?.map((item) => (
        <FilterItem
          label={item.label}
          key={buildPath(item)}
          href={buildPath(item)}
          isActive={isActive(item)}
          status={item.query.status}
          color={item.color}
        />
      ))}
    </div>
  );
};

const FilterItem = ({
  label,
  href,
  isActive,
  color,
  status,
}: {
  label: string;
  href: string;
  isActive: boolean;
  color: string;
  status: string;
}) => {
  const { data, isPending } = useProducts(
    new URLSearchParams({ status }).toString()
  );

  return (
    <Link
      href={href}
      data-active={isActive}
      className="relative inline-flex items-center whitespace-nowrap text-[15px] font-medium justify-center gap-2 pb-3 group/link 
      border-b-2  border-border data-[active=true]:border-black hover:border-black transition z-1"
      style={{ "--color": color } as React.CSSProperties}
    >
      {label}
      {isPending ? (
        <Skeleton className="h-5 w-6 rounded-xl" />
      ) : (
        <Badge
          variant="outline"
          className="min-w-6 border-(--color)/10 bg-(--color)/10 text-(--color) rounded-xl px-1 text-xs"
        >
          {data?.pagination?.total}
        </Badge>
      )}
    </Link>
  );
};
