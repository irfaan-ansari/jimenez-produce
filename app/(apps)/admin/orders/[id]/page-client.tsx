"use client";

import {
  Home,
  CheckCircle,
  MapPinned,
  ChevronLeft,
  CircleCheck,
  ClipboardCheck,
  SquarePen,
  Receipt,
  Package,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import React, { use } from "react";
import { formatUSD } from "@/lib/utils";
import { format } from "date-fns";
import { updateOrder } from "@/server/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/hooks/use-customer";
import { useConfirm } from "@/hooks/use-confirm";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useQueryClient } from "@tanstack/react-query";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { OrderActions } from "@/components/admin/order-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const map = STATUS_MAP[data.status as keyof typeof STATUS_MAP];

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
            <OrderActions showView={false} data={data} />
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
              <div className="flex items-center justify-between gap-4 px-6 py-2">
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

        {/* delivery */}
        <Card className="rounded-2xl">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold">Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Delivery By
            </h4>
            <p>
              {format(data.deliveryDate ?? new Date(), "MMMM dd, yyyy")} -{" "}
              {data.deliveryWindow}
            </p>

            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Instructions
            </h4>
            <p>{data.deliveryInstruction}</p>
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
              <span>Line Items</span> <span>{data.lineItemCount}</span>
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
                {/* {formatUSD(data.subtotal)} */}
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

          <div className="grid gap-4">
            {data.status !== "completed" && (
              <Button
                className="w-full rounded-xl"
                size="xl"
                onClick={handleComplete}
              >
                <CheckCircle />
                Mark as Completed
              </Button>
            )}

            <Button
              className="w-full rounded-xl border-primary/40 bg-primary/20 hover:bg-primary/40"
              size="xl"
              variant="outline"
              asChild
            >
              <a href={`/api/orders/${data.id}/packing-slip`} target="_blank">
                <Package />
                Download Packing Slip
              </a>
            </Button>
            <Button
              className="w-full rounded-xl"
              variant="outline"
              size="xl"
              asChild
            >
              <a href={`/api/orders/${data.id}/invoice`} target="_blank">
                <Receipt />
                Download Invoice
              </a>
            </Button>
          </div>
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
