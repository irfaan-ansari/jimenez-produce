"use client";
import { Pagination } from "@/components/admin/pagination";
import { useRouterStuff } from "@/hooks/use-router-stuff";

export const PageClient = ({ pagination }: { pagination: any }) => {
  const { queryParams } = useRouterStuff();
  return (
    <Pagination
      page={pagination.page}
      limit={pagination.limit}
      total={pagination.total}
      totalPages={pagination.totalPages}
      onPageChange={(page) => queryParams({ set: { page: page.toString() } })}
    />
  );
};
