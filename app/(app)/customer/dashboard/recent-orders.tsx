"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-customer";
import { EmptyComponent } from "@/components/admin/placeholder-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderMap } from "@/lib/constants/user";
import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/utils";

export const RecentOrders = () => {
  const { data, isPending, isError, error } = useOrders("limit=5");
  return (
    <Card className="rounded-2xl border ring-0 shadow-none col-span-6">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
        <Button size="sm" asChild variant="outline" className="rounded-xl">
          <Link href="/customer/orders">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <Table className="text-base">
          <TableHeader>
            <TableRow className="bg-secondary rounded-xl uppercase text-sm font-medium text-muted-foreground">
              <TableHead className="p-4 rounded-l-2xl">Order Placed</TableHead>
              <TableHead className="p-4">Order ID</TableHead>
              <TableHead className="p-4">Items</TableHead>
              <TableHead className="p-4">Status</TableHead>
              <TableHead className="text-right p-4 rounded-r-2xl">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.data?.length ?? 0) > 0 ? (
              data?.data?.map((order) => {
                const map =
                  orderMap[(order.status ?? "active") as keyof typeof orderMap];

                return (
                  <TableRow key={order.id}>
                    <TableCell className="p-4">
                      {format(order.createdAt!, "MMMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium p-4">
                      {order.id}
                    </TableCell>
                    <TableCell className="p-4">
                      {order.lineItems?.[0]?.title}{" "}
                      {order.lineItems.length > 1
                        ? `+ ${order.lineItems.length - 1} Items`
                        : null}
                    </TableCell>
                    <TableCell className="p-4">
                      <Badge
                        variant="outline"
                        style={{ "--color": map.color } as React.CSSProperties}
                        className="h-7 rounded-xl pl-1.5 pr-2.5 gap-1.5 [&>svg]:size-3.5! bg-(--color)/10 border-(--color)/10 text-sm"
                      >
                        <map.icon className="text-(--color)" />
                        {map.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right p-4">
                      {formatUSD(order.total)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="p-0 text-center">
                  {isPending ? (
                    <div className="h-1 bg-primary mb-36 animate-pulse rounded-full"></div>
                  ) : isError ? (
                    <EmptyComponent variant="error" title={error?.message} />
                  ) : (
                    <EmptyComponent variant="empty" />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
