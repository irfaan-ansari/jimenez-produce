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
  const { data, isPending, isError, error } = useOrders("limit=5");
  return (
    <Card className="col-span-6 rounded-2xl border shadow-none ring-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
        <Button size="sm" asChild variant="outline" className="rounded-xl">
          <Link href="/customer/orders">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <Table className="text-base">
          <TableHeader>
            <TableRow className="rounded-xl bg-secondary text-sm font-medium text-muted-foreground uppercase">
              <TableHead className="rounded-l-2xl p-4">Order Placed</TableHead>
              <TableHead className="p-4">Order ID</TableHead>
              <TableHead className="p-4">Items</TableHead>
              <TableHead className="p-4">Status</TableHead>
              <TableHead className="rounded-r-2xl p-4 text-right">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.data?.length ?? 0) > 0 ? (
              data?.data?.map((order) => {
                const map = STATUS_MAP[order.status as keyof typeof STATUS_MAP];

                return (
                  <TableRow key={order.id}>
                    <TableCell className="p-4">
                      {format(order.createdAt!, "MMMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="p-4 font-medium">
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
                        className="h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
                      >
                        <map.icon className="text-(--color)" />
                        {map.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4 text-right">
                      {formatUSD(order.total)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="p-0 text-center">
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
