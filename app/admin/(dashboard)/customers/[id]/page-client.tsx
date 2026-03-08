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
            {data.companyDBA}
          </h1>
          <CustomerAction initialValues={data} showView={false} />
        </div>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row gap-4 ">
            <Avatar className="shrink-0 after:hidden size-12 ring-2 rounded-xl **:rounded-xl ring-offset-1 ring-(--color)/30 relative">
              <AvatarImage src={data.thumbnail!} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                {data.companyDBA}
              </CardTitle>
              <span className="text-muted-foreground">{data.companyType}</span>
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
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Company Legal Name
              </p>
              <p className="text-base">{data.companyName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Doing business as (DBA)
              </p>
              <p className="text-base">{data.companyDBA}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                EIN / TAX ID
              </p>
              <p className="text-base">{data.companyEin}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Address
              </p>
              <p className="text-base">
                {data.companyStreet} {data.companyCity} {data.companyState}{" "}
                {data.companyZip}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Contact Details
              </p>
              <div className="space-y-1">
                <div className="flex gap-2 items-center flex-nowrap">
                  <Phone className="size-4 shrink-0" />
                  <span>{data.companyPhone}</span>
                </div>
                <span className="h-4 w-0.5 bg-foreground/20"></span>
                <div className="flex gap-2 items-center flex-nowrap">
                  <MailCheck className="size-4 shrink-0" />
                  <span>{data.companyEmail}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* delivery prefrences  */}
        <Card className="rounded-2xl pb-2">
          <CardHeader className="space-y-2 text-base">
            <CardTitle className="text-xl font-semibold">
              Delivery Prefrences
            </CardTitle>
            <div className="text-muted-foreground font-medium uppercase">
              Lockbox: {data.lockboxPermission}
            </div>
          </CardHeader>

          <CardContent className="space-y-2 divide-y">
            <div className="flex items-start font-medium">
              <span className="bg-secondary border-b px-4 py-2 w-2/5">
                Day/Window
              </span>
              <span className="bg-secondary border-b px-4 py-2 w-2/5">
                Receiver
              </span>
              <span className="bg-secondary border-b px-4 py-2 flex-1">
                Instructions
              </span>
            </div>
            {data.deliverySchedule.map((sch, i) => {
              return (
                <div className="flex items-start text-base" key={sch.day + i}>
                  <div className="flex gap-2 items-center w-2/5 px-4 py-2">
                    {sch.day}
                    <br />({sch.window})
                  </div>
                  <div className="flex gap-2 w-2/5 px-4 py-2">
                    <div>{sch.receivingName}</div>
                    <div>{sch.receivingPhone}</div>
                  </div>
                  <p className="text-muted-foreground whitespace-pre flex-1 px-4 py-2">
                    {sch.instructions}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
        {/* contact details */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row gap-4">
            <CardTitle className="text-xl font-semibold">
              Authorized Officer
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Officer Name
              </p>
              <p className="text-base">
                {data.officerFirst + " " + data.officerLast}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Contact Details
              </p>
              <div className="space-y-1">
                <div className="flex gap-2 items-center flex-nowrap">
                  <Phone className="size-4 shrink-0" />
                  <span>{data.officerMobile}</span>
                </div>
                <span className="h-4 w-0.5 bg-foreground/20"></span>
                <div className="flex gap-2 items-center flex-nowrap">
                  <MailCheck className="size-4 shrink-0" />
                  <span>{data.officerEmail}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Officer title
              </p>
              <p className="text-base">{data.officerRole}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Address
              </p>
              <p className="text-base whitespace-pre-wrap">
                {data.officerStreet} {data.officerCity} {data.officerState}{" "}
                {data.officerZip}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row gap-4">
            <CardTitle className="text-xl font-semibold">
              Operations & Billing
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Guarantor
              </p>
              <p className="text-base">{data.guarantorName}</p>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Ordering Contact
              </p>
              <p className="text-base">
                {data.orderingName}{" "}
                <span className="text-muted-foreground">
                  ({data.orderingPhone})
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Guarantor Title
              </p>
              <p className="text-base">{data.guarantorRole}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Account Payble
              </p>
              <p className="text-base">{data.accountPayableEmail}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Additional details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Created At
              </p>
              <p className="text-base">
                {format(data.createdAt!, "MMMM dd, yyyy hh:mm:ss a")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                updated at
              </p>
              <p className="text-base">
                {format(data.updatedAt!, "MMMM dd, yyyy hh:mm:ss a")}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                ip address
              </p>
              <p className="text-base"> {data.ipAddress}</p>
              <p> {data.userAgent}</p>
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
                Hold Reason
              </CardTitle>
            </CardHeader>
          )}

          {data.status === "rejected" && (
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Reject Reason
              </CardTitle>
            </CardHeader>
          )}

          {(data.status === "on_hold" || data.status === "rejected") && (
            <CardContent className="min-h-32 border-b text-base space-y-6 pb-6">
              <div className="flex flex-col gap-2">
                <span className="font-semibold uppercase">
                  {data.statusReason}
                </span>
                <span>{data.statusDetails}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="uppercase text-muted-foreground font-semibold text-sm">
                  reviewed by
                </span>
                {/* @ts-expect-error */}
                <span>{data?.user?.name ?? "NA"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="uppercase text-muted-foreground font-semibold text-sm">
                  reviewed at
                </span>
                <span>
                  {format(data.createdAt!, "MMMM dd, yyyy hh:mm:ss a")}
                </span>
              </div>
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
