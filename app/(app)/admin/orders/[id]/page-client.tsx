"use client";

import {
  Home,
  Download,
  CheckCircle,
  MapPinned,
  ChevronLeft,
  CircleCheck,
  ClipboardCheck,
  SquarePen,
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
import { format, isBefore } from "date-fns";
import React, { use } from "react";
import { formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/hooks/use-customer";
import { orderMap } from "@/lib/constants/user";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { OrderActions } from "@/components/admin/order-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { updateOrder } from "@/server/order";
import { useQueryClient } from "@tanstack/react-query";
import { Squada_One } from "next/font/google";

type StatusIndex = keyof typeof orderMap;

export const PageClient = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const { data: result, isPending, error, isError } = useOrder(Number(id));
  // loading
  if (isPending) return <LoadingSkeleton />;

  // error
  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  const { data } = result;

  const status = (data?.status ?? "active") as keyof typeof orderMap;
  const isDelayed = isBefore(data.deliveryDate!, new Date());
  const map = orderMap[isDelayed ? "delayed" : status];

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

  const handleComplete = () => {
    confirm.warning({
      title: "Mark as Completed",
      description: "This will mark the order as delivered to the customer.",
      actionLabel: "Yes",
      cancelLabel: "Cancel",
      action: async () => {
        const { success, error } = await updateOrder(Number(id), {
          status: "completed",
        });

        if (success) {
          toast.success("Order completed successfully.");
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        } else toast.error(error.message);
      },
    });
  };

  return (
    <div
      className="grid grid-cols-6 gap-8"
      style={{ "--color": map.color } as React.CSSProperties}
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
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
            >
              <map.icon className="text-(--color)" />
              {map.label}
            </Badge>
            <OrderActions showView={false} id={data.id} status={data.status!} />
          </div>
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
          <CardContent className="px-0 text-base">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Item</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="pr-6 text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.lineItems.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="size-9 rounded-xl ring-2 ring-green-600/20 ring-offset-1 **:rounded-xl after:hidden">
                          <AvatarImage src={line?.image!} />
                          <AvatarFallback>
                            {line.title?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <h4 className="max-w-3xs truncate font-medium">
                          {line.title}
                        </h4>
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
              <div className="flex items-start justify-between gap-4">
                <h4 className="mb-4 text-sm font-medium text-muted-foreground uppercase">
                  Schedule
                </h4>
                <Button size="icon-xs" variant="ghost" className="rounded-xl">
                  <SquarePen />
                </Button>
              </div>
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
              <span>Subtotal</span> <span>{formatUSD(data.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Fee</span> <span>{formatUSD(data.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span> <span>{formatUSD(data.total)}</span>
            </div>
          </div>

          <Button className="w-full rounded-xl" size="xl" asChild>
            <a href={`/api/orders/${data.id}/pdf`}>
              <Download />
              Download Invoice
            </a>
          </Button>

          {data.status !== "completed" && (
            <Button
              className="w-full rounded-xl"
              size="xl"
              variant="outline"
              onClick={handleComplete}
            >
              <CheckCircle />
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
