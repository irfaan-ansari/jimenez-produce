"use client";

import Link from "next/link";
import { format } from "date-fns";
import React, { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/hooks/use-customer";
import { statusMap } from "@/lib/constants/customer";
import { Attachment } from "@/components/admin/Attachment";
import { ChevronLeft, MailCheck, Phone } from "lucide-react";
import { CustomerAction } from "@/components/admin/customer-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";

type StatusIndex = keyof typeof statusMap;
export const PageClient = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data: result, isPending, error, isError } = useCustomer(Number(id));

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
          <h1 className="text-xl font-semibold flex-1 truncate">
            {data.companyName}
          </h1>
          <CustomerAction
            id={data.id}
            status={data.status as StatusIndex}
            showView={false}
          />
        </div>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row gap-4">
            <Avatar className="shrink-0 after:hidden size-12 ring-2 rounded-xl **:rounded-xl ring-offset-1 ring-(--color)/30 relative">
              <AvatarImage src={data.thumbnail!} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                {data.companyName}
              </CardTitle>
              <span className="h-4 w-0.5 bg-border self-center"></span>

              <div className="flex gap-2 items-start">
                <span>{data.companyDBA}</span>
                <span className="h-4 w-0.5 bg-border self-center"></span>
                <span>{data.companyType}</span>
                <span className="h-4 w-0.5 bg-border self-center"></span>
                <span>{data.companyEin}</span>
              </div>
            </div>
            <Badge
              variant="outline"
              className="ml-auto h-7 rounded-xl pl-1.5 pr-2.5 gap-1.5 [&>svg]:size-3.5! bg-(--color)/10 border-(--color)/10 text-sm"
            >
              <status.icon className="text-(--color)" />
              {status.label}
            </Badge>
          </CardHeader>
          <div className="px-6">
            <span className="border-b block"></span>
          </div>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-muted-foreground uppercase font-medium">
                Address
              </p>
              <p className="text-base">
                {data.companyStreet} {data.companyCity} {data.companyState}{" "}
                {data.companyZip}
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground uppercase font-medium">
                Contact
              </p>
              <div className="space-y-3">
                <div className="flex gap-2 items-center flex-wrap">
                  <Phone className="size-4 shrink-0" />
                  <span>{data.companyPhone}</span>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                  <MailCheck className="size-4 shrink-0" />
                  <span>{data.companyEmail}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* delivery prefrences  */}
        <Card className="rounded-2xl pb-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Delivery Prefrences
            </CardTitle>
            <div className="text-muted-foreground">
              Lock box permission: {data.lockboxPermission}
            </div>
          </CardHeader>

          <CardContent className="space-y-4 text-base divide-y">
            {data.deliverySchedule.map((sch, i) => {
              return (
                <div className="py-4 space-y-4" key={sch.day + i}>
                  <div className="mb-2 flex gap-2 items-center">
                    <span>{sch.day}</span>
                    <span>{sch.window}</span>
                  </div>
                  <div className="flex gap-2">
                    <div>{sch.receivingName}</div>
                    <div>{sch.receivingPhone}</div>
                  </div>
                  <p className="text-muted-foreground whitespace-pre">
                    {sch.instructions}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
        {/* contact details */}
        <Card className="rounded-2xl text-base">
          <CardHeader className="flex flex-row gap-4">
            <CardTitle>Primary Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold">
                  {data.officerFirst} {data.officerLast}
                </CardTitle>
                <div className="text-muted-foreground">{data.officerRole}</div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2 items-center">
                  <Phone className="size-4 shrink-0" />
                  <span>{data.officerMobile}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <MailCheck className="size-4 shrink-0" />
                  <span>{data.officerEmail}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground uppercase font-medium">
                Address
              </p>
              <p className="text-base whitespace-pre-wrap">
                {data.officerStreet} {data.officerCity} {data.officerState}{" "}
                {data.officerZip}
              </p>
            </div>
          </CardContent>
          <div className="px-6">
            <span className="border-b block"></span>
          </div>

          <CardContent className="grid grid-cols-2">
            <div className="space-y-6 pr-6 pb-6 border-b border-r">
              <CardTitle className="text-muted-foreground">
                Guarantor details
              </CardTitle>
              <div className="space-y-2 text-base">
                <div>{data.guarantorName}</div>
                <div>Role: {data.guarantorRole}</div>
              </div>
            </div>
            <div className="space-y-6 pl-6 pb-6 border-b">
              <CardTitle className="text-muted-foreground">
                Ordering Details
              </CardTitle>
              <div className="space-y-2 text-base">
                <div>{data.orderingName}</div>
                <div>{data.orderingPhone}</div>
              </div>
            </div>
            <div className="space-y-6 pr-6 pt-6 border-r">
              <CardTitle className="text-muted-foreground">
                Account Payable
              </CardTitle>
              <div className="text-base">{data.accountPayableEmail}</div>
            </div>
            <div className="space-y-6 pl-6 py-6">
              <CardTitle className="text-muted-foreground">
                Authorized Signatory
              </CardTitle>
              <div className="text-base">{data.signatureName}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Additional details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="mr-1 inline-block text-muted-foreground">
                Created at:
              </span>
              {format(data.createdAt!, "dd-mm-yyyy hh:mm:ss a")}
            </div>
            <div>
              <span className="mr-1 inline-block text-muted-foreground">
                Updated at:
              </span>
              {format(data.updatedAt!, "dd-mm-yyyy hh:mm:ss a")}
            </div>
            <div>
              <span className="mr-1 inline-block text-muted-foreground">
                IP Address:
              </span>
              {data.ipAddress}
            </div>
            <div>
              <span className="mr-1 inline-block text-muted-foreground">
                User Agent:
              </span>
              {data.userAgent}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* right col */}
      <div className="col-span-6 lg:col-span-2">
        <Card className="rounded-2xl bg-neutral-50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Notes</CardTitle>
          </CardHeader>
          <CardContent className="min-h-32 border-b divide-y whitespace-pre">
            {data.internalNotes}
          </CardContent>

          {/* hold or reject reason */}
          {data.status === "on_hold" && (
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Hold reason
              </CardTitle>
            </CardHeader>
          )}

          {data.status === "rejected" && (
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Reject reason
              </CardTitle>
            </CardHeader>
          )}

          {(data.status === "on_hold" || data.status === "rejected") && (
            <CardContent className="min-h-32 border-b">
              {data.statusReason}
              <br />
              {data.statusDetails}
            </CardContent>
          )}

          <CardHeader>
            <CardTitle className="text-xl font-semibold">Documents</CardTitle>
          </CardHeader>
          <CardContent className="border-b divide-y">
            <Attachment
              url={data.certificateUrl as string}
              label="Resale Cirtificate"
            />
            <Attachment
              url={data.dlFrontUrl as string}
              label="Driver's Licence (Front)"
            />
            <Attachment
              url={data.dlBackUrl as string}
              label="Driver's Licence (Back)"
            />
            <Attachment url={data.signatureUrl as string} label="Signature" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
