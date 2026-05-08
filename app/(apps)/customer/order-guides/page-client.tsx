"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useOrderGuides } from "@/hooks/use-orders";
import { Pagination } from "@/components/admin/pagination";
import { useRouterStuff } from "@/hooks/use-router-stuff";

export const OrderGuidesClientPage = () => {
  const { queryParams } = useRouterStuff();
  const { data: guide, isPending, isError, error } = useOrderGuides();

  if (isPending) return <LoadingSkeleton />;
  if (isError) return <EmptyComponent variant="error" title={error.message} />;

  const { data } = guide;

  if (data?.length === 0)
    return <EmptyComponent variant="empty" title="No order guides found" />;

  const { page, total, totalPages, limit } = guide.pagination;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {data?.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-3 flex-1">
              <CardTitle className="text-lg font-semibold">
                {item.name}
              </CardTitle>
              {!item.teamId && (
                <Badge
                  variant="secondary"
                  className="h-6 bg-amber-100 border border-amber-200"
                >
                  Suggested
                </Badge>
              )}
              <CardDescription>{item.description}</CardDescription>
            </CardContent>

            <CardFooter className="border-t">
              <Link
                href={`/customer/order-guides/${item.id}`}
                className="flex items-center justify-between w-full font-medium"
                tabIndex={-1}
              >
                {item.itemCount} items
                <Button size="icon-sm" variant="secondary">
                  <ArrowRight />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* pagination */}
      {!isPending && !isError && (
        <Pagination
          page={page}
          total={total}
          totalPages={totalPages}
          limit={limit}
          onPageChange={(page) =>
            queryParams({ set: { page: page.toString() } })
          }
        />
      )}
    </>
  );
};
