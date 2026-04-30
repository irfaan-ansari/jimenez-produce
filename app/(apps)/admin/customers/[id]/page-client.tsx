"use client";
import Link from "next/link";

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline";
import { ChevronLeft, CircleDashed, PackageCheck } from "lucide-react";
import { useTeam } from "@/hooks/use-teams";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { use } from "react";
import { formatUSD } from "@/lib/utils";
import { format } from "date-fns/format";

export const PageClient = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data: result, isPending, isError, error } = useTeam(id);

  // loading
  if (isPending) return <LoadingSkeleton />;

  // error
  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  const { data } = result;

  console.log(data);
  return (
    <div className="grid grid-cols-6 gap-8">
      <div className="col-span-6 space-y-6 lg:col-span-4">
        {/* page header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              asChild
              variant="outline"
              className="shrink-0 rounded-xl"
            >
              <Link href="/admin/customers/">
                <ChevronLeft /> Back
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">{data.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button size="lg">Invite Member</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="flex-row px-6 items-start">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold mb-2">
                {/* @ts-expect-error */}
                {data.stats?.activeCount}
              </CardTitle>
              <CardDescription className="mb-6 font-semibold text-base">
                {/* @ts-expect-error */}
                {formatUSD(data.stats?.activeValue)}
              </CardDescription>
              <span className="text-sm font-medium text-muted-foreground">
                Active Orders
              </span>
            </div>
            <span className="size-10 inline-flex text-foreground rounded-lg p-0 justify-center items-center bg-amber-100">
              <CircleDashed className="size-4" />
            </span>
          </Card>
          <Card className="flex-row px-6 items-start">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold mb-2">
                {/* @ts-expect-error */}
                {data.stats?.completedCount}
              </CardTitle>
              <CardDescription className="mb-6 font-semibold text-base">
                {/* @ts-expect-error */}
                {formatUSD(data.stats?.completedValue)}
              </CardDescription>
              <span className="text-sm font-medium text-muted-foreground">
                Completed Orders
              </span>
            </div>
            <span className="size-10 inline-flex text-foreground rounded-lg p-0 justify-center items-center bg-green-100">
              <PackageCheck className="size-4" />
            </span>
          </Card>
        </div>
      </div>
      <Card className="col-span-2 rounded-2xl bg-card">
        <CardHeader>
          <CardTitle className="font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-base">
          <Timeline defaultValue={1} className="w-full">
            {/* @ts-expect-error */}
            {data?.recentOrders?.map((order) => (
              <TimelineItem key={order.id} step={1}>
                <TimelineHeader>
                  <TimelineDate>
                    {format(order.createdAt, "MMM dd")}
                  </TimelineDate>
                  <TimelineTitle>#{order.id}</TimelineTitle>
                </TimelineHeader>
                <TimelineIndicator />
                <TimelineSeparator />
                <TimelineContent className="bg-secondary p-4 rounded-xl space-y-0.5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatUSD(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatUSD(order.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{order?.charges?.type}</span>
                    <span>{formatUSD(order?.charges?.amount)}</span>
                  </div>
                  <div className="flex justify-between text-foreground text-base font-semibold mt-2">
                    <span>Total</span>
                    <span>{formatUSD(order.total)}</span>
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </CardContent>
      </Card>
    </div>
  );
};
