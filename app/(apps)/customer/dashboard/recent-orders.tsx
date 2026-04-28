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
import { formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-customer";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { EmptyComponent } from "@/components/admin/placeholder-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RecentOrders = () => {
  const { data, isPending, isError, error } = useOrders({
    path: "/api/teams/orders",
    query: "limit=5",
  });
  return (
    <Card className="col-span-6 rounded-2xl border shadow-none ring-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
        <Button size="sm" asChild variant="outline" className="rounded-xl">
          <Link href="/customer/orders">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="overflow-hidden px-0">
        <Table className="text-base">
          <TableHeader>
            <TableRow className="bg-secondary text-sm font-medium text-muted-foreground uppercase">
              <TableHead className="p-4">Order</TableHead>
              <TableHead className="p-4">Placed</TableHead>
              <TableHead className="p-4">Delivery</TableHead>
              <TableHead className="w-24 p-4 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.data?.length ?? 0) > 0 ? (
              data?.data?.map((order) => {
                const map = STATUS_MAP[order.status as keyof typeof STATUS_MAP];

                return (
                  <TableRow key={order.id}>
                    <TableCell className="p-4">
                      <Link
                        href={`/customer/orders/${order.id}`}
                        className="flex flex-col gap-1.5"
                      >
                        <div className="flex items-center gap-2">
                          #{order.id}
                          <Badge
                            variant="outline"
                            style={
                              { "--color": map.color } as React.CSSProperties
                            }
                            className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
                          >
                            <map.icon className="text-(--color)" />
                            {map.label}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Tap to view order details
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="p-4 font-medium">
                      <span className="text-sm text-muted-foreground">
                        {format(order.createdAt!, "MMM dd • hh:mm a")}
                      </span>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {format(order.deliveryDate || new Date(), "MMMM dd")}
                        </span>
                        <span>•</span>
                        <span>
                          {order.status === "completed"
                            ? "Delivered"
                            : (order.deliveryWindow ?? "Anytime")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <span className="font-medium">
                        {formatUSD(order.total)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="p-0 text-center">
                  {isPending ? (
                    <div className="mb-36 h-1 animate-pulse rounded-full bg-primary"></div>
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
