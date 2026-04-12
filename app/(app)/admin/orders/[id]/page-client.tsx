"use client";

import Link from "next/link";
import { format } from "date-fns";
import React, { use } from "react";
import { formatUSD } from "@/lib/utils";
import {
  ChevronLeft,
  CircleCheck,
  ClipboardCheck,
  Copy,
  Download,
  Home,
  MapPinned,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/hooks/use-customer";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { orderMap } from "@/lib/constants/user";
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OrderActions } from "@/components/admin/order-actions";

type StatusIndex = keyof typeof orderMap;

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

  const status = orderMap[data?.status as StatusIndex];

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
      date: data.status === "completed" ? data.updatedAt : data.deliveryDate,
      active: data.status === "completed",
    },
  ];

  return (
    <div
      className="grid grid-cols-6 gap-8"
      style={{ "--color": status.color } as React.CSSProperties}
    >
      <div className="col-span-6 lg:col-span-4 space-y-6">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <Button
              size="sm"
              asChild
              variant="outline"
              className="rounded-xl shrink-0"
            >
              <Link href="/customer/orders">
                <ChevronLeft /> Back
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">Order #{data.id}</h1>
          </div>
          <div className="flex gap-4 items-center">
            <Badge
              variant="outline"
              className="h-7 rounded-xl pl-1.5 pr-2.5 gap-1.5 [&>svg]:size-3.5! bg-(--color)/10 border-(--color)/10 text-sm"
            >
              <status.icon className="text-(--color)" />
              {status.label}
            </Badge>
            <OrderActions showView={false} id={data.id} />
          </div>
        </div>

        {/* progress */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex gap-4 items-center text-lg font-semibold">
              <MapPinned className="size-5 shrink-0" />
              Order Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between gap-4 text-base">
            {STEPS.map((step, i) => (
              <StepItem key={i} {...step} />
            ))}
          </CardContent>
        </Card>

        {/* purchased items */}
        <Card className="rounded-2xl">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold">
              Purchased Items ({data?.lineItemCount})
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Item</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right pr-6">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.lineItems.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="pl-6">
                      <div className="flex gap-4 items-start">
                        <Avatar className="rounded-xl **:rounded-xl after:hidden size-9 ring-2 ring-offset-1 ring-green-600/20">
                          <AvatarImage src={line?.image!} />
                          <AvatarFallback>
                            {line.title?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <h4 className="font-medium max-w-3xs truncate">
                          {line.title}
                        </h4>
                      </div>
                    </TableCell>
                    <TableCell>{formatUSD(line.price!)}</TableCell>
                    <TableCell>{line.quantity}</TableCell>
                    <TableCell className="text-right pr-6">
                      {formatUSD(line.total!)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* delivery */}
        <Card className="rounded-2xl">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold">Delivery</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-base">
            <div>
              <h4 className="uppercase text-sm font-medium text-muted-foreground mb-4">
                Shipping Address
              </h4>
              {data.shippingAddress?.street} {data.shippingAddress?.city}{" "}
              {data.shippingAddress?.state} {data.shippingAddress?.zip}
            </div>
            <div>
              <h4 className="uppercase text-sm font-medium text-muted-foreground mb-4">
                Recipient
              </h4>
              <div>{data.receiverName}</div>
              <div>{data.receiverPhone}</div>
            </div>
            <div>
              <h4 className="uppercase text-sm font-medium text-muted-foreground mb-4">
                Schedule
              </h4>
              <div>{data.deliveryWindow}</div>
              <div>{format(data.createdAt!, "MMMM dd, hh:mm a")}</div>
              <div>{data.deliveryInstruction}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* order summary */}
      <Card className="rounded-2xl bg-secondary col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-base">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Subtotal</span> <span>{formatUSD(data.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Fee</span> <span>{formatUSD(data.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span> <span>{formatUSD(data.total)}</span>
            </div>
          </div>

          <Button className="rounded-xl w-full" size="xl" asChild>
            <a href={`/api/orders/${data.id}/pdf`}>
              <Download />
              Download Invoice
            </a>
          </Button>

          {data.status !== "completed" && (
            <Button className="rounded-xl w-full" size="xl" variant="outline">
              <Copy />
              Mark as Completed
            </Button>
          )}
        </CardContent>
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
  <div className="flex flex-col self-center items-center">
    <span
      className={`size-10 mb-2 rounded-xl inline-flex items-center justify-center ${
        active ? "bg-primary text-primary-foreground" : "bg-secondary"
      }`}
    >
      <Icon className="size-4" />
    </span>

    <span className="uppercase text-base">{label}</span>

    <span className="text-muted-foreground text-sm">
      {format(date!, "MMMM dd, hh:mm a")}
    </span>
  </div>
);
