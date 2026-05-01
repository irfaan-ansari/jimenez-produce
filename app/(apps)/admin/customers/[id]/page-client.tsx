"use client";
import { use } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { formatUSD } from "@/lib/utils";
import { format } from "date-fns/format";
import { useTeam } from "@/hooks/use-teams";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { ChevronLeft, CircleDashed, PackageCheck } from "lucide-react";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { Badge } from "@/components/ui/badge";

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
        {/* stats cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="flex-row items-start px-6">
            <div className="flex-1">
              <CardTitle className="mb-2 text-3xl font-bold">
                {/* @ts-expect-error */}
                {data.stats?.activeCount}
              </CardTitle>
              <CardDescription className="mb-6 text-base font-semibold">
                {/* @ts-expect-error */}
                {formatUSD(data.stats?.activeValue)}
              </CardDescription>
              <span className="text-sm font-medium text-muted-foreground">
                Active Orders
              </span>
            </div>
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-amber-100 p-0 text-foreground">
              <CircleDashed className="size-4" />
            </span>
          </Card>
          <Card className="flex-row items-start px-6">
            <div className="flex-1">
              <CardTitle className="mb-2 text-3xl font-bold">
                {/* @ts-expect-error */}
                {data.stats?.completedCount}
              </CardTitle>
              <CardDescription className="mb-6 text-base font-semibold">
                {/* @ts-expect-error */}
                {formatUSD(data.stats?.completedValue)}
              </CardDescription>
              <span className="text-sm font-medium text-muted-foreground">
                Completed Orders
              </span>
            </div>
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-green-100 p-0 text-foreground">
              <PackageCheck className="size-4" />
            </span>
          </Card>
        </div>

        {/* Product access */}
        <Card className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CardHeader>
            <CardTitle className="font-semibold">Product access</CardTitle>
            <CardDescription>
              Manage product access of this team
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2"></CardContent>
        </Card>

        {/* Tax rules */}
        <Card className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CardHeader>
            <CardTitle className="font-semibold">Tax rules</CardTitle>
            <CardDescription>Manage tax rules of this team</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2"></CardContent>
        </Card>

        {/* members */}
        <Card className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CardHeader>
            <CardTitle className="font-semibold">Members</CardTitle>
            <CardDescription>Manage members of this team</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2"></CardContent>
        </Card>
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
                <TimelineHeader className="flex items-start gap-2">
                  <div className="flex-1">
                    <TimelineDate>
                      {format(order.createdAt, "MMM dd")}
                    </TimelineDate>
                    <TimelineTitle>#{order.id}</TimelineTitle>
                  </div>
                  <TimelineBadge status={order.status} />
                </TimelineHeader>
                <TimelineIndicator />
                <TimelineSeparator />
                <TimelineContent className="space-y-0.5 rounded-xl bg-secondary p-4">
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
                  <div className="mt-2 flex justify-between text-base font-semibold text-foreground">
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

const TimelineBadge = ({ status }: { status: string }) => {
  const map = STATUS_MAP[status as keyof typeof STATUS_MAP];
  return (
    <Badge
      variant="outline"
      style={{ "--color": map.color } as React.CSSProperties}
      className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
    >
      <map.icon className="text-(--color)" />
      {map.label}
    </Badge>
  );
};
