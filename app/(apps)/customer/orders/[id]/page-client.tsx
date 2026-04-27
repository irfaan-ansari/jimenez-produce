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
        <Card className="gap-0 rounded-2xl py-0 relative">
          <LiveTracking />

          <CardContent className="absolute inset-x-3 h-20 bottom-3 rounded-lg p-3 bg-background/70 backdrop-blur-lg z-2 ring-2 ring-border shadow-sm ring-offset-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">Order #24647</p>
                <div className="flex gap-2 items-center">
                  <span className="font-medium text-muted-foreground">
                    Estimated delivery in
                  </span>
                  <span className="text-2xl font-bold">30 mins</span>
                </div>
              </div>
              <Badge className="h-7 bg-green-100 border border-green-300 text-green-600 px-4">
                Arriving
              </Badge>
            </div>
          </CardContent>
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
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Item Count</span>{" "}
              <span className="font-medium">{data.lineItemCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Quantity</span>{" "}
              <span className="font-medium">{data.lineItemQuantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>{" "}
              <span className="font-medium">{formatUSD(data.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax ({data?.taxName})</span>
              <span className="font-medium">{formatUSD(data.tax)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{data.charges?.type}</span>
              <span className="font-medium">
                {formatUSD(data.charges?.amount ?? 0)}
              </span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-xl font-semibold">
            <span>Total</span> <span>{formatUSD(data.total)}</span>
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
