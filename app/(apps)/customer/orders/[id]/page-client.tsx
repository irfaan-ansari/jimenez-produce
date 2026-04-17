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
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import Link from "next/link";
import { format } from "date-fns";
import React, { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/hooks/use-customer";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { formatUSD, getAvatarFallback } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      date: data.status === "completed" ? data.updatedAt : data.deliveryDate,
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
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-4 text-lg font-semibold">
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
          <CardContent className="px-0">
            <Table className="text-base">
              <TableBody>
                {data.lineItems.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="pl-6 w-9 align-top pt-3">
                      <Avatar className="size-9 rounded-xl ring-2 ring-green-600/20 ring-offset-1 **:rounded-xl after:hidden">
                        <AvatarImage src={line?.image!} />
                        <AvatarFallback>{line.title?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-2xs w-full">
                        <h4 className="leading-tight font-medium whitespace-normal">
                          {line.title}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="border border-border rounded-xl"
                        >
                          {line.identifier}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatUSD(line.price!)}</TableCell>
                    <TableCell>{line.quantity}</TableCell>
                    <TableCell className="pr-6 text-right">
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
              <h4 className="mb-4 text-sm font-medium text-muted-foreground uppercase">
                Shipping Address
              </h4>
              {data.shippingAddress?.street} {data.shippingAddress?.city}{" "}
              {data.shippingAddress?.state} {data.shippingAddress?.zip}
            </div>
            <div>
              <h4 className="mb-4 text-sm font-medium text-muted-foreground uppercase">
                Recipient
              </h4>
              <div>{data.receiverName}</div>
              <div>{data.receiverPhone}</div>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-medium text-muted-foreground uppercase">
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
      <Card className="col-span-2 rounded-2xl bg-secondary">
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
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span> <span>{formatUSD(data.total)}</span>
            </div>
          </div>
          <Button className="w-full rounded-xl" size="xl" asChild>
            <a href={`/api/orders/${data.id}/invoice`} target="_blank">
              <Download />
              Download Invoice
            </a>
          </Button>

          <Button
            className="w-full rounded-xl"
            size="xl"
            variant="outline"
            asChild
          >
            <Link href={`/customer/orders/new?orderId=${data.id}`}>
              <Copy />
              Order Again
            </Link>
          </Button>
        </CardContent>
        {data.po && (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Po</CardTitle>
            </CardHeader>
            <CardContent>{data.po}</CardContent>
          </>
        )}
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
      className={`size-10 mb-2 rounded-xl inline-flex items-center justify-center ${
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
