"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useOrderGuide, useOrderGuides } from "@/hooks/use-orders";
import { Pagination } from "@/components/admin/pagination";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { formatUSD } from "@/lib/utils";

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
      <div className="grid grid-cols-1 gap-6">
        {data?.map((item) => (
          <Card key={item.id} className="border">
            <CardHeader className="flex flex-row gap-4 border-b">
              <div className="flex-1 space-y-1">
                <CardTitle className="text-lg font-semibold">
                  {item.name}
                </CardTitle>
                {!item.teamId && (
                  <Badge
                    variant="secondary"
                    className="h-6 border border-amber-200 bg-amber-100"
                  >
                    Suggested
                  </Badge>
                )}
                <CardDescription>{item.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {item.itemCount} items
                </span>

                <span>•</span>
                <span className="font-medium">
                  {formatUSD(total)} Estimated
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-1">
              <GuideItems id={item.id} />
            </CardContent>

            <CardFooter className="border-t">
              <Link
                href={`/customer/order-guides/${item.id}`}
                className="flex w-full items-center justify-between font-medium"
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

const GuideItems = ({ id }: { id: number }) => {
  const { data, isPending, isError, error } = useOrderGuide(id);

  if (isPending) return <LoadingSkeleton />;

  if (isError) return <EmptyComponent variant="error" title={error.message} />;

  if (!data)
    return <EmptyComponent variant="empty" title="No order guides found" />;
  if (data.data.items.length === 0)
    return <EmptyComponent variant="empty" title="No order guides found" />;

  return (
    <div className="grid grid-cols-4 gap-6">
      {data.data.items.map((item) => (
        <Card className="relative mx-auto w-full max-w-sm pt-0">
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
          <img
            src="https://avatar.vercel.sh/shadcn1"
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
          />
          <CardHeader>
            <CardTitle>Design systems meetup</CardTitle>
            <CardDescription>
              A practical talk on component APIs, accessibility, and shipping
              faster.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full">View Event</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
