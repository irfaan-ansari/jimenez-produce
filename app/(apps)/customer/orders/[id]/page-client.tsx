"use client";

import { Copy, Home, Download, ChevronLeft, CreditCard, ImageOff } from "lucide-react";
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

import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";

type StatusIndex = keyof typeof STATUS_MAP;

export const PageClient = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data: result, isPending, error, isError } = useOrder(Number(id));
  const confirm = useConfirm();
  // loading
  if (isPending) return <LoadingSkeleton />;

  // error
  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  const { data } = result;

  const status = STATUS_MAP[data?.status as StatusIndex];
  const paymentStatus = STATUS_MAP["unpaid"];

  const handlePay = () => {
    confirm.warning({
      title: "Pay Invoice?",
      description:
        "You will be redirected to our secure payment page to complete payment for this invoice.",
      actionLabel: "Pay Now",
      cancelLabel: "Cancel",
      action: async () => {
        // Redirect to payment gateway
      },
    });
  };
  return (
    <div className="grid grid-cols-6 gap-8">
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
            <h1 className="font-semibold line-clamp-1">Order #{data.id}</h1>
          </div>
          <div className="flex gap-2 items-center">
            <Badge
              variant="outline"
              className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
              style={{ "--color": status.color } as React.CSSProperties}
            >
              <status.icon className="text-(--color)" />
              {status.label}
            </Badge>

            <Badge
              variant="outline"
              className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
              style={{ "--color": paymentStatus.color } as React.CSSProperties}
            >
              <paymentStatus.icon className="text-(--color)" />
              {paymentStatus.label}
            </Badge>
          </div>
        </div>

        {/* purchased items */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Order items</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {data.lineItems.map((line) => (
              <div
                className="flex items-start gap-3 not-first:pt-2 not-last:pb-2"
                key={line.id}
              >
                <div className="size-16 border relative bg-secondary rounded-lg inline-flex items-center justify-center shrink-0">
                  {line.image ? <img className="absolute mix-blend-multiply inset-0 size-full object-contain" src={line.image} width={100} height={100} /> : <ImageOff className="sise-6 text-muted-foreground" />}
                </div>

                <div className="space-y-2 flex-1">
                  <h4 className="font-medium leading-tight whitespace-normal">
                    {line.title}
                  </h4>

                  <div className="flex justify-start gap-4">
                    <span className="text-muted-foreground">#{line.identifier}</span>

                    {line.unit && <>
                      <span>|</span>
                      {formatUSD(line.price!)}/{line.unit}
                    </>}
                    <div className="flex gap-2 md:gap-8 ml-auto">
                      <span className="text-muted-foreground font-medium">
                        {line.quantity} x {formatUSD(line.price!)}
                        {line.unit && <span className="text-[10px] text-muted-foreground">/{line.unit}</span>}
                      </span>
                      <span className="font-medium">
                        {formatUSD(line.total!)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* order summary */}
      <Card className="col-span-6 lg:col-span-2 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Item Count</span>{" "}
            <span className="font-medium">{data.lineItemCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Quantity</span>{" "}
            <span className="font-medium">{data.lineItemQuantity}</span>
          </div>
          <div className="border-t" />

          <div className="flex items-center justify-between">
            <span>Subtotal</span>{" "}
            <span className="font-medium">{formatUSD(data.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax {data?.taxName && `(${data.taxName})`}</span>
            <span
              className={`font-medium ${Number(data?.tax) > 0 ? "text-red-700" : ""}`}
            >
              {formatUSD(data.tax)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>{data.charges?.type}</span>
            <span
              className={`font-medium ${Number(data.charges?.amount) > 0 ? "text-red-700" : ""}`}
            >
              {formatUSD(data.charges?.amount ?? 0)}
            </span>
          </div>
          <div className="border-t" />

          <div className="flex items-center justify-between text-xl font-semibold">
            <span>Total Payable</span>{" "}
            <span className="text-primary">{formatUSD(data.total)}</span>
          </div>
          <div className="space-y-3">
            <Button className="w-full rounded-xl " size="xl" asChild>
              <a href={`/api/orders/${data.id}/invoice`} target="_blank">
                <Download />
                Download Invoice
              </a>
            </Button>
            <Button
              className="w-full rounded-xl bg-sidebar hover:bg-sidebar/80"
              size="xl"
              disabled
              onClick={handlePay}
            >
              <CreditCard />
              Pay Now
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="text-sm">
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Delivery By
            </h4>
            <div>{data.deliveryWindow}</div>
            <div>{format(data.createdAt!, "MMMM dd • hh:mm a")}</div>
          </div>
          <div className="text-sm">
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Instructions
            </h4>
            <div className="whitespace-pre-line">
              {data.deliveryInstruction}
            </div>
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
      className={`size-10 mb-2 rounded-lg inline-flex items-center justify-center ${active ? "bg-primary text-primary-foreground" : "bg-secondary"
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
