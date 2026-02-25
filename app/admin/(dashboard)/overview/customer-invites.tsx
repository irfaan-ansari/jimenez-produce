"use client";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInvites } from "@/hooks/use-customer";
import { inviteStatusMap } from "@/lib/constants/customer";
import Link from "next/link";
import React from "react";

export const CustomerInvites = () => {
  const { data, isPending } = useInvites("?limit=5");
  return (
    <Card className="col-span-6 lg:col-span-4 rounded-2xl">
      <CardHeader>
        <CardTitle className="font-semibold text-lg flex justify-between">
          Customer Invites
          <Button variant="outline" size="sm" asChild className="rounded-xl">
            <Link href="/admin/invites">View All</Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex flex-col h-full gap-3">
          <div className="overflow-hidden **:data-[slot=table-container]:no-scrollbar">
            {isPending ? (
              <LoadingSkeleton />
            ) : (
              <Table>
                <TableHeader className="bg-secondary">
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Officer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data && data.data?.length > 0 ? (
                    data?.data?.map((cus) => {
                      const map =
                        inviteStatusMap[
                          cus.status as keyof typeof inviteStatusMap
                        ] || {};

                      return (
                        <TableRow key={cus.id}>
                          <TableCell>{cus.companyName}</TableCell>
                          <TableCell className="font-medium">
                            {cus.firstName + " " + cus.lastName}
                          </TableCell>
                          <TableCell>{cus.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              style={
                                {
                                  "--color": map.color,
                                } as React.CSSProperties
                              }
                              className="h-7 rounded-xl pl-1.5 pr-2.5 gap-1.5 [&>svg]:size-3.5! bg-(--color)/10 border-(--color)/10 text-sm"
                            >
                              <map.icon className="text-(--color)" />

                              {map.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        <EmptyComponent variant="empty" />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
