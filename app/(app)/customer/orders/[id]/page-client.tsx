"use client";

import Link from "next/link";
import { format } from "date-fns";
import React, { use } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { useOrder } from "@/hooks/use-customer";
import { statusMap } from "@/lib/constants/customer";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatUSD } from "@/lib/utils";

type StatusIndex = keyof typeof statusMap;
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

  const status = statusMap[data?.status as StatusIndex];

  return (
    <div
      className="grid grid-cols-6 gap-8"
      style={{ "--color": status.color } as React.CSSProperties}
    >
      <div className="col-span-6 lg:col-span-4 space-y-6">
        <div className="flex gap-4 items-center">
          <Button
            size="sm"
            asChild
            variant="outline"
            className="rounded-xl shrink-0"
          >
            <Link href="/admin/customers">
              <ChevronLeft /> Back
            </Link>
          </Button>
          <h1 className="text-xl font-semibold flex-1 truncate">{data.id}</h1>
          <div className="flex gap-2 items-center">
            <span>{format(data.createdAt!, "MMMM dd, yyyy")}</span>
            <span className="text-muted-foreground text-sm">
              {format(data.createdAt!, "hh:mm:ss a")}
            </span>
          </div>
        </div>
        <Card className="rounded-2xl">
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="divide-y lg:col-span-2">
              <div className="grid grid-cols-5 gap-4">
                <div className="py-2 col-span-2">Item</div>
                <div className="py-2 text-right">Price</div>
                <div className="py-2 text-right">Quantity</div>
                <div className="py-2 text-right">Ext.</div>
              </div>
              {Array(10)
                .fill(data.lineItems[0])
                .map((item) => (
                  <div className="grid grid-cols-5 gap-4">
                    <div className="py-4 col-span-2">
                      <div className="flex gap-4 items-start">
                        <Avatar className="rounded-xl **:rounded-xl after:hidden size-9 ring-2 ring-offset-1 ring-green-600/20">
                          <AvatarImage src={item.image!} />
                          <AvatarFallback>P</AvatarFallback>
                        </Avatar>

                        <h4 className="font-medium max-w-3xs truncate">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                    <div className="py-4 text-right">
                      {formatUSD(item.price!)}
                    </div>
                    <div className="py-4 text-right">{item.quantity}</div>
                    <div className="py-4 text-right">
                      {formatUSD(item.total!)}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-2xl col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Notes</CardTitle>
        </CardHeader>
        <CardContent>{data.notes}</CardContent>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.shippingAddress?.street} {data.shippingAddress?.city}{" "}
          {data.shippingAddress?.state} {data.shippingAddress?.zip}
        </CardContent>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">recipient</CardTitle>
        </CardHeader>
        <CardContent>
          <div>{data.receiverName}</div>
          <div>{data.receiverPhone}</div>
        </CardContent>
      </Card>
    </div>
  );
};
