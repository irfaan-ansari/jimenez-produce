"use client";

import {
  Copy,
  Home,
  Download,
  MapPinned,
  ChevronLeft,
  CircleCheck,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import React, { use } from "react";
import { formatUSD } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/hooks/use-customer";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LiveTracking } from "./live-tracking";

import { Badge } from "@/components/reui/badge";
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

import { cn } from "@/lib/utils";
import { CheckIcon, PlayIcon, CircleIcon } from "lucide-react";

const releases = [
  {
    id: 1,
    version: "v1.0",
    date: "Jan 2025",
    title: "Initial Release",
    status: "released",
  },
  {
    id: 2,
    version: "v1.1",
    date: "Mar 2025",
    title: "Bug Fixes",
    status: "released",
  },
  {
    id: 3,
    version: "v2.0",
    date: "Jun 2025",
    title: "Major Update",
    status: "current",
  },
  {
    id: 4,
    version: "v2.1",
    date: "Sep 2025",
    title: "Improvements",
    status: "upcoming",
  },
];

type StatusIndex = keyof typeof STATUS_MAP;

export const PageClient = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data: result, isPending, error, isError } = useOrder(Number(id));

  // loading
  if (isPending) return <LoadingSkeleton />;

  // error
  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  const { data } = result;

  const status = STATUS_MAP[data?.status as StatusIndex];

  const STEPS = [
    {
      icon: CircleCheck,
      label: "Ordered",
      date: data.createdAt,
      active: true,
    },
    {
      icon: ClipboardCheck,
      label: "Processing",
      date: data.createdAt,
      active: true,
    },
    {
      icon: Home,
      label: data.status === "completed" ? "Delivered" : "Delivery",
      date: data.status === "completed" ? data.updatedAt : data.updatedAt,
      active: data.status === "completed",
    },
  ];

  return (
    <div
      className="grid grid-cols-6 gap-8"
      style={{ "--color": status.color } as React.CSSProperties}
    >
      <div className="col-span-6 space-y-6 lg:col-span-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              asChild
              variant="outline"
              className="shrink-0 rounded-xl"
            >
              <Link href="/customer/orders">
                <ChevronLeft /> Back
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">Order #{data.id}</h1>
          </div>
          <Badge
            variant="outline"
            className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
          >
            <status.icon className="text-(--color)" />
            {status.label}
          </Badge>
        </div>

        {/* progress */}
        <Card className="flex flex-row gap-6 rounded-2xl py-0">
          <div className="flex-1">
            <LiveTracking />
          </div>
          <div className="w-full max-w-2xs space-y-4 py-6">
            <div>
              <div className="flex-1 items-center space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Order #75675746887
                </h4>
                <p className="font-semibold">On its way to you</p>
              </div>

              <span className="inline-flex  h-8 items-center justify-self-end rounded-lg bg-yellow-500 px-3">
                In Transit
              </span>
            </div>
            <Timeline
              defaultValue={3}
              orientation="vertical"
              className="w-full"
            >
              {releases.map((release) => (
                <TimelineItem key={release.id} step={release.id}>
                  <TimelineHeader>
                    <TimelineSeparator className="bg-input! group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:left-2.5 group-data-[orientation=horizontal]/timeline:w-[calc(100%-2.25rem)]" />
                    <TimelineDate>{release.date}</TimelineDate>
                    <TimelineTitle className="flex items-center gap-2">
                      {release.version}
                      {release.status === "current" && (
                        <Badge variant="primary-light" size="sm">
                          Current
                        </Badge>
                      )}
                    </TimelineTitle>
                    <TimelineIndicator
                      className={cn(
                        "flex size-6 items-center justify-center border-none",
                        release.status === "released" &&
                          "bg-emerald-500 text-white",
                        release.status === "current" &&
                          "bg-primary text-primary-foreground",
                        release.status === "upcoming" &&
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {release.status === "released" ? (
                        <CheckIcon className="size-3.5" />
                      ) : release.status === "current" ? (
                        <PlayIcon className="size-3" />
                      ) : (
                        <CircleIcon className="size-3" />
                      )}
                    </TimelineIndicator>
                  </TimelineHeader>
                  <TimelineContent className="text-xs">
                    {release.title}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </Card>

        {/* purchased items */}
        <Card className="gap-0 rounded-2xl">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold">
              Purchased Items ({data?.lineItemCount})
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y px-0">
            <div className="flex items-center justify-between gap-4 bg-muted px-6 py-4 font-medium text-muted-foreground uppercase">
              <div className="flex-1">Item</div>
              <div className="w-20 text-right">Price</div>
              <div className="w-20 text-right">Quantity</div>
              <div className="w-20 text-right">Total</div>
            </div>

            {data.lineItems.map((line) => (
              <div
                className="flex items-center justify-between gap-4 px-6 py-2"
                key={line.id}
              >
                <div className="flex flex-1 items-center gap-3">
                  <Avatar className="size-9 rounded-lg ring-2 ring-green-600/20 ring-offset-1 **:rounded-lg after:hidden">
                    <AvatarImage src={line?.image!} />
                    <AvatarFallback>{line.title?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="leading-tight font-medium whitespace-normal">
                      {line.title}
                    </h4>
                    {line.identifier && (
                      <Badge
                        variant="secondary"
                        className="rounded-xl border border-border"
                      >
                        {line.identifier}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="w-20 text-right text-muted-foreground">
                  {formatUSD(line.price!)}
                </div>
                <div className="w-20 text-right text-muted-foreground">
                  {line.quantity}
                </div>
                <div className="w-20 text-right font-semibold">
                  {formatUSD(line.total!)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* order summary */}

      <Card className="col-span-2 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-base">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Item Count</span> <span>{data.lineItemCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Quantity</span> <span>{data.lineItemQuantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span> <span>{formatUSD(data.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <span>
                {/* {formatUSD(data.tax)} */}
                TBD
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>{data.charges?.type}</span>
              <span>{formatUSD(data.charges?.amount ?? 0)}</span>
            </div>
            <Separator className="my-6" />
            <div className="flex items-center justify-between text-xl font-semibold">
              <span>Total</span> <span>{formatUSD(data.total)}</span>
            </div>
          </div>
          <Button className="w-full rounded-xl " size="xl" asChild>
            <a href={`/api/orders/${data.id}/invoice`} target="_blank">
              <Download />
              Download Invoice
            </a>
          </Button>

          <Button
            className="w-full rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
            size="xl"
            asChild
          >
            <Link href={`/customer/new-order?id=${data.id}`}>
              <Copy />
              Reorder
            </Link>
          </Button>

          <Separator className="my-6" />

          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground uppercase">
              Shipping Address
            </h4>
            <div>{data.shippingAddress?.street}</div>
            <div>
              {data.shippingAddress?.city} {data.shippingAddress?.state}{" "}
              {data.shippingAddress?.zip}
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground uppercase">
              Schedule
            </h4>
            <div>{data.deliveryWindow}</div>
            <div>{format(data.createdAt!, "MMMM dd, hh:mm a")}</div>
            <div>{data.deliveryInstruction}</div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground uppercase">
              Instructions
            </h4>
            <div>{data.deliveryInstruction}</div>
          </div>
        </CardContent>

        {data.notes && (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Notes</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-line">
              {data.notes}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

const StepItem = ({
  icon: Icon,
  label,
  date,
  active,
}: {
  icon: any;
  label: string;
  date: string | Date | null;
  active: boolean;
}) => (
  <div className="flex flex-col items-center self-center">
    <span
      className={`size-10 mb-2 rounded-lg inline-flex items-center justify-center ${
        active ? "bg-primary text-primary-foreground" : "bg-secondary"
      }`}
    >
      <Icon className="size-4" />
    </span>

    <span className="text-base uppercase">{label}</span>

    <span className="text-sm text-muted-foreground">
      {format(date!, "MMMM dd, hh:mm a")}
    </span>
  </div>
);
