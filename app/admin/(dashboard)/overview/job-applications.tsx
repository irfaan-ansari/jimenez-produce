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
import { useJobApplications } from "@/hooks/use-job-application";
import { statusMap } from "@/lib/constants/customer";
import { jobApplicationStatusMap } from "@/lib/constants/job";
import Link from "next/link";
import React from "react";

export const JobApplications = () => {
  const { data, isPending } = useJobApplications("?limit=5");
  return (
    <Card className="col-span-6 lg:col-span-4 rounded-2xl">
      <CardHeader>
        <CardTitle className="font-semibold text-lg flex justify-between">
          Job Applications
          <Button variant="outline" size="sm" asChild className="rounded-xl">
            <Link href="/admin/job-applications">View All</Link>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Date Available</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                {data?.data && data.data?.length > 0 ? (
                  <TableBody>
                    {data?.data?.map((cus) => {
                      const map =
                        jobApplicationStatusMap[
                          cus.status as keyof typeof jobApplicationStatusMap
                        ] || {};

                      return (
                        <TableRow key={cus.id}>
                          <TableCell>
                            {cus.firstName + " " + cus.lastName}
                          </TableCell>
                          <TableCell className="font-medium">
                            {cus.email}
                          </TableCell>
                          <TableCell>{cus.position}</TableCell>
                          <TableCell>{cus.availableStartDate}</TableCell>
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
                    })}
                  </TableBody>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <EmptyComponent variant="empty" />
                    </TableCell>
                  </TableRow>
                )}
              </Table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
