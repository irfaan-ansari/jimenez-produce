"use client";

import Link from "next/link";
import { format } from "date-fns";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { updateCustomer } from "@/server/customer";
import { useCustomer } from "@/hooks/use-customer";
import { useQueryClient } from "@tanstack/react-query";
import { STATUS_MAP } from "@/lib/constants/status-map";
import { Attachment } from "@/components/admin/Attachment";
import { ChevronLeft, MailCheck, Phone } from "lucide-react";
import { CustomerAction } from "@/components/admin/customer-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatusIndex = keyof typeof STATUS_MAP;
export const PageClient = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: result, isPending, error, isError } = useCustomer(Number(id));

  // loading
  if (isPending) return <LoadingSkeleton />;

  // error
  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  const { data } = result;

  const status = STATUS_MAP[data?.status as StatusIndex];

  return (
    <div
      className="grid grid-cols-6 gap-8"
      style={{ "--color": status.color } as React.CSSProperties}
    >
      <div className="col-span-6 space-y-6 lg:col-span-4">
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 rounded-xl"
            onClick={() => router.back()}
          >
            <ChevronLeft /> Back
          </Button>
          <h1 className="flex-1 truncate text-xl font-semibold">
            {data.companyDBA}
          </h1>
          <CustomerAction data={data} showView={false} />
        </div>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row gap-4 ">
            <Avatar className="relative size-12 shrink-0 rounded-xl ring-2 ring-(--color)/30 ring-offset-1 **:rounded-xl after:hidden">
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
              className="ml-auto h-7 gap-1.5 rounded-xl border-(--color)/10 bg-(--color)/10 pr-2.5 pl-1.5 text-sm [&>svg]:size-3.5!"
            >
              <status.icon className="text-(--color)" />
              {status.label}
            </Badge>
          </CardHeader>
          <div className="px-6">
            <span className="block border-b"></span>
          </div>
          <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Company Legal Name
              </p>
              <p className="text-base">{data.companyName}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Doing business as (DBA)
              </p>
              <p className="text-base">{data.companyDBA}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                EIN / TAX ID
              </p>
              <p className="text-base">{data.companyEin}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Address
              </p>
              <p className="text-base">
                {data.companyStreet} {data.companyCity} {data.companyState}{" "}
                {data.companyZip}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Contact Details
              </p>
              <div className="space-y-1">
                <div className="flex flex-nowrap items-center gap-2">
                  <Phone className="size-4 shrink-0" />
                  <span>{data.companyPhone}</span>
                </div>
                <span className="h-4 w-0.5 bg-foreground/20"></span>
                <div className="flex flex-nowrap items-center gap-2">
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
            <div className="font-medium text-muted-foreground uppercase">
              Lockbox: {data.lockboxPermission}
            </div>
          </CardHeader>

          <CardContent className="space-y-2 divide-y">
            <div className="flex items-start font-medium">
              <span className="w-2/5 border-b bg-secondary px-4 py-2">
                Day/Window
              </span>
              <span className="w-2/5 border-b bg-secondary px-4 py-2">
                Receiver
              </span>
              <span className="flex-1 border-b bg-secondary px-4 py-2">
                Instructions
              </span>
            </div>
            {data.deliverySchedule.map((sch, i) => {
              return (
                <div className="flex items-start text-base" key={sch.day + i}>
                  <div className="flex w-2/5 items-center gap-2 px-4 py-2">
                    {sch.day}
                    <br />({sch.window})
                  </div>
                  <div className="flex w-2/5 gap-2 px-4 py-2">
                    <div>{sch.receivingName}</div>
                    <div>{sch.receivingPhone}</div>
                  </div>
                  <p className="flex-1 px-4 py-2 whitespace-pre text-muted-foreground">
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
          <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Officer Name
              </p>
              <p className="text-base">
                {data.officerFirst + " " + data.officerLast}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Contact Details
              </p>
              <div className="space-y-1">
                <div className="flex flex-nowrap items-center gap-2">
                  <Phone className="size-4 shrink-0" />
                  <span>{data.officerMobile}</span>
                </div>
                <span className="h-4 w-0.5 bg-foreground/20"></span>
                <div className="flex flex-nowrap items-center gap-2">
                  <MailCheck className="size-4 shrink-0" />
                  <span>{data.officerEmail}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Officer title
              </p>
              <p className="text-base">{data.officerRole}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
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
          <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Guarantor
              </p>
              <p className="text-base">{data.guarantorName}</p>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
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
              <p className="font-medium text-muted-foreground uppercase">
                Guarantor Title
              </p>
              <p className="text-base">{data.guarantorRole}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
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
          <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Created At
              </p>
              <p className="text-base">
                {format(data.createdAt!, "MMMM dd, yyyy hh:mm:ss a")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                updated at
              </p>
              <p className="text-base">
                {format(data.updatedAt!, "MMMM dd, yyyy hh:mm:ss a")}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
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
          <CardContent className="min-h-32 divide-y border-b whitespace-pre">
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
            <CardContent className="min-h-32 space-y-6 border-b pb-6 text-base">
              <div className="flex flex-col gap-2">
                <span className="font-semibold uppercase">
                  {data.statusReason}
                </span>
                <span>{data.statusDetails}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-muted-foreground uppercase">
                  reviewed by
                </span>
                {/* @ts-expect-error */}
                <span>{data?.reviewer?.name ?? "NA"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-muted-foreground uppercase">
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
          <CardContent className="divide-y">
            <Attachment
              url={data.certificateUrl as string}
              label="Resale Certificate"
              onUpdate={async (newUrl) => {
                await updateCustomer(data.id, {
                  certificateUrl: newUrl,
                });
                queryClient.invalidateQueries({
                  queryKey: ["customer"],
                });
              }}
            />
            <Attachment
              url={data.dlFrontUrl as string}
              label="Driver's Licence (Front)"
              onUpdate={async (newUrl) => {
                await updateCustomer(data.id, {
                  dlFrontUrl: newUrl,
                });
                queryClient.invalidateQueries({
                  queryKey: ["customer"],
                });
              }}
            />
            <Attachment
              url={data.dlBackUrl as string}
              label="Driver's Licence (Back)"
              onUpdate={async (newUrl) => {
                await updateCustomer(data.id, {
                  dlBackUrl: newUrl,
                });
                queryClient.invalidateQueries({
                  queryKey: ["customer"],
                });
              }}
            />
            <Attachment
              url={data.signatureUrl as string}
              label="Signature"
              onUpdate={async (newUrl) => {
                await updateCustomer(data.id, {
                  signatureUrl: newUrl,
                });
                queryClient.invalidateQueries({
                  queryKey: ["customer"],
                });
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
