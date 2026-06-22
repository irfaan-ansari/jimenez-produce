"use client";

import {
  Home,
  CheckCircle,
  ChevronLeft,
  CircleCheck,
  ClipboardCheck,
  Receipt,
  Package,
  ImageOff,
  Truck,
  BadgeCheck,
  UserCheck,
  Mail,
  Download,
} from "lucide-react";
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
import { useRouter } from "next/navigation";
import { CopyButton } from "@/components/copy-button";

export const PageClient = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();
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
  const paymentMap = STATUS_MAP["unpaid"];

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

  const handleAction = (action: string) => {
    switch (action) {
      case "complete":
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
        break;
      case "send-invoice":
        confirm.warning({
          title: "Send Invoice?",
          description: "This will send an invoice to the customer.",
          actionLabel: "Send",
          cancelLabel: "Cancel",
          action: async () => {
            // const { success, error } = await updateOrder(Number(id), {
            //   status: "completed",
            // });
            // if (success) {
            //   toast.success("Order completed successfully.");
            //   queryClient.invalidateQueries({ queryKey: ["orders"] });
            // } else toast.error(error.message);
          },
        });
        break;
      case "mark-paid":
        confirm.warning({
          title: "Mark as Paid?",
          description: "This will mark the order as paid.",
          actionLabel: "Proceed",
          cancelLabel: "Cancel",
          action: async () => {
            // const { success, error } = await updateOrder(Number(id), {
            //   status: "completed",
            // });
            // if (success) {
            //   toast.success("Order completed successfully.");
            //   queryClient.invalidateQueries({ queryKey: ["orders"] });
            // } else toast.error(error.message);
          },
        });
        break;
    }
  };

  return (
    <div className="grid grid-cols-6 gap-8">
      <div className="col-span-6 space-y-6 lg:col-span-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 rounded-xl"
              onClick={() => router.back()}
            >
              <ChevronLeft /> Back
            </Button>
            <h1 className="text-lg font-semibold line-clamp-1">
              Order #{data.id}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
              style={{ "--color": map.color } as React.CSSProperties}
            >
              <map.icon className="text-(--color)" />
              {map.label}
            </Badge>

            {/* payment badge */}
            {data.status == "completed" && (
              <Badge
                variant="outline"
                className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
                style={{ "--color": paymentMap.color } as React.CSSProperties}
              >
                <paymentMap.icon className="text-(--color)" />
                {paymentMap.label}
              </Badge>
            )}
            <OrderActions showView={false} data={data} />
          </div>
        </div>

        {/* progress */}
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col md:flex-row relative justify-between items-start gap-4 text-base">
            {STEPS.map((step, i) => (
              <StepItem key={i} {...step} />
            ))}
          </CardContent>
        </Card>

        {/* stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="flex-row items-start px-6 rounded-xl">
            <div className="flex-1">
              <CardTitle className="mb-2 font-medium">Delivery</CardTitle>
              <span className="text-sm font-medium text-muted-foreground">
                {data.deliveryDate + " " + data.deliveryWindow}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {data.deliveryInstruction}
              </span>
            </div>
            <Badge className="size-10" variant="success-light">
              <Truck className="size-4" />
            </Badge>
          </Card>
          <Card className="flex-row items-start px-6 rounded-xl">
            <div className="flex-1">
              <CardTitle className="mb-2 font-medium uppercase text-xs text-muted-foreground">
                Customer
              </CardTitle>
              <span className="text-sm font-medium line-clamp-1">
                {data.team?.name}
              </span>
              <CopyButton value={data.team?.phone} />
              <CopyButton value={data.team?.email} />
            </div>
            <Badge className="size-10" variant="info-light">
              <BadgeCheck className="size-4" />
            </Badge>
          </Card>
          <Card className="flex-row items-start px-6 rounded-xl">
            <div className="flex-1 truncate min-w-0">
              <CardTitle className="mb-2 font-medium uppercase text-xs text-muted-foreground">
                Placed by
              </CardTitle>
              <span className="text-sm font-medium truncate line-clamp-1">
                {data.user?.name}
              </span>
              <CopyButton value={data.user?.phoneNumber ?? ""} />
              <CopyButton value={data.user?.email ?? ""} />
            </div>
            <Badge className="size-10 shrink-0" variant="warning-light">
              <UserCheck className="size-4" />
            </Badge>
          </Card>
        </div>
        {/* purchased items */}
        <Card className="rounded-2xl">
          {/* <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Items ({data?.lineItemCount})
            </CardTitle>
          </CardHeader> */}
          <CardContent className="divide-y">
            <div className="flex items-center gap-4 py-2 text-xs font-medium text-muted-foreground uppercase">
              <div className="flex-1">Item</div>
              <div className="w-20 text-right text-muted-foreground">Price</div>
              <div className="w-20 text-right text-muted-foreground">
                Quantity
              </div>
              <div className="w-20 text-right text-muted-foreground">Tax</div>
              <div className="w-20 text-right text-muted-foreground">Total</div>
            </div>
            {data.lineItems.map((line) => (
              <div className="flex items-center justify-between gap-4 p-2">
                <div className="flex items-center flex-1 gap-3">
                  <Avatar className="size-9 rounded-md ring-2 ring-ring ring-offset-1 **:rounded-md after:hidden">
                    <AvatarImage src={line?.image!} />
                    <AvatarFallback>
                      <ImageOff className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="font-medium leading-tight whitespace-normal">
                      {line.title}
                    </h4>
                    {line.identifier && (
                      <Badge
                        variant="secondary"
                        className="border rounded-sm! border-border"
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
                <div className="w-20 text-right text-muted-foreground">
                  {line.taxAmount}
                </div>
                <div className="w-20 font-semibold text-right">
                  {formatUSD(line.total!)}
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
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Line Items</span> <span>{data.lineItemCount}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Quantity</span> <span>{data.lineItemQuantity}</span>
            </div>
          </div>
          <div className="border-t" />
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Subtotal</span> <span>{formatUSD(data.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>
              Tax {Number(data.tax) > 0 && data?.taxName && `(${data.taxName})`}
            </span>
            <span
              className={`font-medium ${Number(data?.tax) > 0 ? "text-red-700" : ""}`}
            >
              {formatUSD(data.tax)}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>{data.charges?.type}</span>
            <span
              className={`font-medium ${Number(data.charges?.amount) > 0 ? "text-red-700" : ""}`}
            >
              {formatUSD(data.charges?.amount ?? 0)}
            </span>
          </div>
          <div className="border-t" />
          <div className="flex items-center justify-between text-xl font-bold">
            <span>Total Payable</span>
            <span className="text-primary">{formatUSD(data.total)}</span>
          </div>

          <div className="grid gap-3">
            {data.status !== "completed" && (
              <Button
                className="w-full rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
                size="xl"
                onClick={() => handleAction("complete")}
              >
                <CheckCircle />
                Complete Order
              </Button>
            )}

            {data?.status === "completed" ? (
              <Button
                className="w-full rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
                size="xl"
                asChild
              >
                <a href={`/api/orders/${data.id}/invoice`} target="_blank">
                  <Download />
                  Download Invoice
                </a>
              </Button>
            ) : (
              <Button className="w-full rounded-xl" size="xl" asChild>
                <a href={`/api/orders/${data.id}/packing-slip`} target="_blank">
                  <Package />
                  Packing Slip
                </a>
              </Button>
            )}
          </div>
          {data.status == "completed" && (
            <>
              <div className="border-t" />
              <div className="grid gap-3">
                <Button
                  className="w-full rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80"
                  size="xl"
                  onClick={() => handleAction("send-invoice")}
                >
                  <Mail />
                  Send Invoice
                </Button>
                <Button
                  className="w-full rounded-xl"
                  size="xl"
                  onClick={() => handleAction("mark-paid")}
                >
                  <Mail />
                  Mark as Paid (Manually)
                </Button>
              </div>
            </>
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
  <div className="flex md:flex-col items-start md:items-center gap-3 self-start">
    <span
      className={`size-9 rounded-lg inline-flex items-center justify-center ${
        active ? "bg-primary text-primary-foreground" : "bg-slate-200"
      }`}
    >
      <Icon className="size-4" />
    </span>
    <div className="flex flex-col md:items-center">
      <span className="text-sm font-medium uppercase">{label}</span>
      <span className="text-xs text-muted-foreground">
        {format(date!, "MMMM dd, hh:mm a")}
      </span>
    </div>
  </div>
);
