"use client";

import { use } from "react";
import Link from "next/link";
import { differenceInMonths, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MailCheck, Phone } from "lucide-react";
import {
  EmptyComponent,
  LoadingSkeleton,
} from "@/components/admin/placeholder-component";
import { JobApplicationStatus } from "@/lib/types";
import { Attachment } from "@/components/admin/Attachment";
import { jobApplicationStatusMap } from "@/lib/constants/job";
import { useJobApplication } from "@/hooks/use-job-application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobApplicationAction } from "@/components/admin/job-application-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateJobApplication } from "@/server/job";
import { useQueryClient } from "@tanstack/react-query";
import { getInitialsAvatar } from "@/lib/utils";

export const PageClient = ({ params }: { params: Promise<{ id: string }> }) => {
  const param = use(params);
  const {
    data: result,
    isPending,
    error,
    isError,
  } = useJobApplication(Number(param.id));
  const queryClient = useQueryClient();
  // loading
  if (isPending) return <LoadingSkeleton />;

  // error
  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  const { data } = result;

  const status = jobApplicationStatusMap[data?.status as JobApplicationStatus];

  const thumbnail = getInitialsAvatar(data.firstName);
  return (
    <div
      className="grid grid-cols-6 gap-8"
      style={{ "--color": status.color } as React.CSSProperties}
    >
      <div className="col-span-6 space-y-6 lg:col-span-4">
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            asChild
            variant="outline"
            className="shrink-0 rounded-xl"
          >
            <Link href="/admin/applications/candidate">
              <ChevronLeft /> Back
            </Link>
          </Button>
          <h1 className="flex-1 truncate text-xl font-semibold">
            {data.applicantName}
          </h1>
          {/* action button */}
          <JobApplicationAction showView={false} initialValues={data} />
        </div>
        {/* applicant details */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row gap-4">
            <Avatar className="relative size-12 shrink-0 rounded-xl ring-2 ring-(--color)/30 ring-offset-1 **:rounded-xl after:hidden">
              <AvatarImage src={thumbnail!} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                {data.firstName} {data.lastName}
              </CardTitle>
              <span className="text-muted-foreground">{data.position}</span>
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
                Applicant Name
              </p>
              <p className="text-base">
                {data.firstName} {data.lastName}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">DOB</p>
              <p className="text-base">{format(data.dob, "MMMM dd, yyyy")}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Available Date
              </p>
              <p className="text-base">
                {format(data.availableStartDate, "MMMM dd, yyyy")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Social Security #
              </p>
              <p className="text-base">{data.socialSecurity}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Work Authorization
              </p>
              <p className="text-base capitalize">{data.hasLegalRights}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Contact Details
              </p>
              <div className="space-y-1">
                <div className="flex flex-nowrap items-center gap-2">
                  <Phone className="size-4 shrink-0" />
                  <span>{data.phone}</span>
                </div>
                <span className="h-4 w-0.5 bg-foreground/20"></span>
                <div className="flex flex-nowrap items-center gap-2">
                  <MailCheck className="size-4 shrink-0" />
                  <span>{data.email}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Current Address
              </p>
              <p className="text-base">
                {data.currentAddress.street} {data.currentAddress.city}{" "}
                {data.currentAddress.state} {data.currentAddress.zip}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground uppercase">
                Previous Address
              </p>
              <p className="text-base">
                {data.mailingAddress.street} {data.mailingAddress.city}{" "}
                {data.mailingAddress.state} {data.mailingAddress.zip}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* education details */}
        <Card className="rounded-2xl">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold">Education</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="font-medium text-muted-foreground uppercase">
                Name
              </div>
              <div className="text-base">{data.collage?.institutionName}</div>
            </div>
            <div className="space-y-1">
              <div className="textsm text-muted-foreground">School</div>
              <div className="text-base">{data.collage?.fieldOfStudy}</div>
            </div>
            <div className="space-y-1">
              <div className="textsm text-muted-foreground">Location</div>
              <div className="text-base">{data.collage?.location}</div>
            </div>
            <div className="space-y-1">
              <div className="textsm text-muted-foreground">Year Completed</div>
              <div className="text-base">{data.collage?.yearCompleted}</div>
            </div>
            <div className="col-span-2 space-y-1">
              <div className="textsm text-muted-foreground">Details</div>
              <div className="text-base">{data.collage?.details}</div>
            </div>
          </CardContent>

          <CardContent className="grid grid-cols-2 gap-6 border-t pt-6">
            <div className="space-y-2">
              <div className="font-medium text-muted-foreground uppercase">
                Institution Name
              </div>
              <div className="text-base">{data.collage?.institutionName}</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-muted-foreground uppercase">
                Field of Study
              </div>
              <div className="text-base">{data.collage?.fieldOfStudy}</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-muted-foreground uppercase">
                Location
              </div>
              <div className="text-base">{data.collage?.location}</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-muted-foreground uppercase">
                Year Completed
              </div>
              <div className="text-base">{data.collage?.yearCompleted}</div>
            </div>
            <div className="col-span-2 space-y-1">
              <div className="font-medium text-muted-foreground uppercase">
                Details
              </div>
              <div className="text-base">{data.collage?.details}</div>
            </div>
          </CardContent>
          {/* other education */}
          {Array.isArray(data?.otherEducations?.length) &&
            data?.otherEducations?.length > 0 && (
              <>
                <CardHeader className="border-b">
                  <CardTitle className="text-xl font-semibold">Other</CardTitle>
                </CardHeader>
                {data.otherEducations?.map((edu, i) => (
                  <CardContent
                    className="grid grid-cols-2 gap-6 not-last:border-b not-last:pb-6"
                    key={i}
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        Institution Name
                      </div>
                      <div className="text-base">{edu?.institutionName}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        Field of Study
                      </div>
                      <div className="text-base">{edu?.fieldOfStudy}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        Location
                      </div>
                      <div className="text-base">{edu?.location}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        Year Completed
                      </div>
                      <div className="text-base">{edu?.yearCompleted}</div>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        Details
                      </div>
                      <div className="text-base">{edu?.details}</div>
                    </div>
                  </CardContent>
                ))}
              </>
            )}
        </Card>

        {/* employement details */}
        {Array.isArray(data.experience) && data.experience.length > 0 && (
          <Card className="rounded-2xl">
            <CardHeader className="border-b">
              <CardTitle className="text-xl font-semibold">
                Employement History
              </CardTitle>
            </CardHeader>
            {data.experience.map((emp, i) => (
              <CardContent
                key={i}
                className="grid grid-cols-2 gap-6 not-last:border-b not-last:pb-6"
              >
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    Employer Name
                  </div>
                  <div className="text-base">{emp.employerName}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    Employer Phone
                  </div>
                  <div className="text-base">{emp.phone}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    Employer Address
                  </div>
                  <div className="text-base">{emp.address}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    Position
                  </div>
                  <div className="text-base">{emp.position}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    Duration
                  </div>
                  <div className="text-base">
                    {differenceInMonths(emp.toDate, emp.fromDate)} Months
                  </div>
                  <div className="text-base text-muted-foreground">
                    {format(emp.fromDate, "MMMM dd, yyyy") +
                      " - " +
                      format(emp.toDate, "MMMM dd, yyyy")}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    Salary
                  </div>
                  <div className="text-base">{emp.salary}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    FMCSA Applied
                  </div>
                  <div className="capitalize">{emp.safetySensitive}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    Safety-Sensitive (DOT)
                  </div>
                  <div className="capitalize">{emp.subjectToFmcsa}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    Reason for Leaving
                  </div>
                  <div className="text-base">{emp.reasonForLeaving}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    Explain eny Gaps
                  </div>
                  <div className="text-base">{emp.gap}</div>
                </div>
              </CardContent>
            ))}
          </Card>
        )}

        {/* address */}
        {Array.isArray(data.addresses) && data.addresses.length ? (
          <Card className="rounded-2xl text-base">
            {/* addresses */}
            <CardHeader className="border-b">
              <CardTitle className="text-xl font-semibold">Addresses</CardTitle>
            </CardHeader>

            {data.addresses.map((add, i) => (
              <CardContent
                key={i}
                className="not-last:boredr-b grid grid-cols-2 gap-6 not-last:pb-6"
              >
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    Street
                  </div>
                  <div className="text-base">{add.street}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    City
                  </div>
                  <div className="text-base">{add.city}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    State
                  </div>
                  <div className="text-base">{add.state}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    Zip
                  </div>
                  <div className="text-base">{add.zip}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-muted-foreground uppercase">
                    Years at Address
                  </div>
                  <div className="text-base">{add.yearsAtAddress}</div>
                </div>
              </CardContent>
            ))}
          </Card>
        ) : null}

        {/* license */}
        <Card className="rounded-2xl">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold">License</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6 not-last:border-b not-last:pb-6">
            <div className="space-y-1">
              <div className="font-medium text-muted-foreground uppercase">
                License #
              </div>
              <div className="text-base">
                {data.currentLicense?.licenseNumber}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-muted-foreground uppercase">
                Type/Class
              </div>
              <div className="text-base">
                {data.currentLicense?.licenseType}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-muted-foreground uppercase">
                Expiry Date
              </div>
              <div className="text-base">
                {data.currentLicense?.expiryDate
                  ? format(data.currentLicense?.expiryDate, "MMMM dd, yyyy")
                  : ""}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-muted-foreground uppercase">
                Endorsements
              </div>
              <div className="text-base">
                {data.currentLicense?.endorsements}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-muted-foreground uppercase">
                Issuing State
              </div>
              <div className="text-base">{data.currentLicense?.state}</div>
            </div>
          </CardContent>
          {/* licenses */}
          {Array.isArray(data.licenses) && data.licenses.length > 0 && (
            <>
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-semibold">
                  Licenses
                </CardTitle>
              </CardHeader>
              {data.licenses.map((lic, i) => (
                <CardContent
                  key={i}
                  className="grid grid-cols-2 gap-6 not-last:border-b not-last:pb-6"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      License #
                    </div>
                    <div className="text-base">{lic.licenseNumber}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Type/Class
                    </div>
                    <div className="text-base">{lic.licenseType}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Expiry Date
                    </div>
                    <div className="text-base"> {lic.expiryDate}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Endorsements
                    </div>
                    <div>{lic.endorsements}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Issuing State
                    </div>
                    <div className="text-base">{lic.state}</div>
                  </div>
                </CardContent>
              ))}
            </>
          )}
        </Card>

        {/* driving experience */}
        {Array.isArray(data.drivingExperiences) &&
          data.drivingExperiences.length > 0 && (
            <Card className="rounded-2xl">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-semibold">
                  Driving Experience
                </CardTitle>
              </CardHeader>
              {data.drivingExperiences.map((exp, i) => (
                <CardContent
                  key={i}
                  className="grid grid-cols-2 gap-6 not-last:border-b not-last:pb-6"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Category
                    </div>
                    <div className="text-base">{exp.category}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Type
                    </div>
                    <div className="text-base">{exp.type}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Duration
                    </div>
                    <div className="text-base">
                      {differenceInMonths(exp.toDate, exp.fromDate)} Months
                    </div>
                    <div className="text-base text-muted-foreground">
                      {format(exp.fromDate, "MMMM dd, yyyy") +
                        " - " +
                        format(exp.toDate, "MMMM dd, yyyy")}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Approx Miles Total
                    </div>
                    <div className="text-base">{exp.approxMilesTotal}</div>
                  </div>
                </CardContent>
              ))}
            </Card>
          )}

        {/* accident history */}
        {Array.isArray(data.accidentHistory) &&
          data.accidentHistory.length > 0 && (
            <Card className="rounded-2xl">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-semibold">
                  Accident History
                </CardTitle>
              </CardHeader>
              {data.accidentHistory.map((acc, i) => (
                <CardContent className="grid grid-cols-2 gap-6 not-last:border-b not-last:pb-6">
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Date
                    </div>
                    <div className="text-base">{acc.accidentDate}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Nature
                    </div>
                    <div className="text-base">{acc.accidentNature}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Injuries Count
                    </div>
                    <div className="text-base">{acc.injuriesCount}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Fatalities Count
                    </div>
                    <div className="text-base">{acc.fatalitiesCount}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground uppercase">
                      Chemical Spill
                    </div>
                    <div className="text-base">{acc.chemicalSpill}</div>
                  </div>
                </CardContent>
              ))}
            </Card>
          )}

        {/* traffic convictions*/}
        {Array.isArray(data.trafficConvictions) &&
          data.trafficConvictions.length > 0 && (
            <>
              <Card className="rounded-2xl">
                <CardHeader className="border-b">
                  <CardTitle className="text-xl font-semibold">
                    Accident History
                  </CardTitle>
                </CardHeader>
                {data.trafficConvictions.map((tc, i) => (
                  <CardContent className="grid grid-cols-2 gap-6 not-last:border-b not-last:pb-6">
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        Date
                      </div>
                      <div className="text-base"> {tc.dateConvicted}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        Violation
                      </div>
                      <div className="text-base">{tc.violation}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        Location
                      </div>
                      <div className="text-base">{tc.state}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        Penalty
                      </div>
                      <div className="text-base">{tc.penalty}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        License Ever Denied
                      </div>
                      <div className="text-base">{tc.licenseDenied}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        Reason for License Denial
                      </div>
                      <div className="text-base">{tc.licenseDeniedReason}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        License Ever Suspended
                      </div>
                      <div className="text-base">{tc.licenseSuspended}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground uppercase">
                        Reason for Suspension
                      </div>
                      <div className="text-base">
                        {tc.licenseSuspendedReason}
                      </div>
                    </div>
                  </CardContent>
                ))}
              </Card>
            </>
          )}

        {/* additional details */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Additional details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="font-medium text-muted-foreground uppercase">
                Created At:
              </div>
              <span className="text-base">
                {format(data.createdAt!, "MMMM dd, yyyy hh:mm:ss a")}
              </span>
            </div>
            <div>
              <div className="font-medium text-muted-foreground uppercase">
                Updated At:
              </div>
              <span className="text-base">
                {format(data.updatedAt!, "MMMM dd, yyyy hh:mm:ss a")}
              </span>
            </div>
            <div>
              <div className="font-medium text-muted-foreground uppercase">
                IP Address:
              </div>
              <div className="grid gap-1 text-base">
                {data?.ipAddress}
                {data?.userAgent}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-6 lg:col-span-2">
        <Card className="sticky top-6 rounded-2xl bg-sidebar text-base">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Notes</CardTitle>
          </CardHeader>
          <CardContent className="min-h-32 border-b whitespace-pre">
            {data.internalNotes}
          </CardContent>

          {data.status === "rejected" && (
            <>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Rejection Reason
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-32 border-b whitespace-pre">
                {data.statusReason}
              </CardContent>
            </>
          )}
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="divide-y border-b">
            <Attachment
              url={data.drivingLicenseFrontUrl as string}
              label="Driving License (Front)"
              onUpdate={async (newUrl) => {
                await updateJobApplication(data.id, {
                  drivingLicenseFrontUrl: newUrl,
                });
                queryClient.invalidateQueries({
                  queryKey: ["job-application"],
                });
              }}
            />
            <Attachment
              url={data.drivingLicenseBackUrl as string}
              label="Driving License (Front)"
              onUpdate={async (newUrl) => {
                await updateJobApplication(data.id, {
                  drivingLicenseBackUrl: newUrl,
                });
                queryClient.invalidateQueries({
                  queryKey: ["job-application"],
                });
              }}
            />
            <Attachment
              url={data.dotFrontUrl as string}
              label="DOT (Front)"
              onUpdate={async (newUrl) => {
                await updateJobApplication(data.id, {
                  dotFrontUrl: newUrl,
                });
                queryClient.invalidateQueries({
                  queryKey: ["job-application"],
                });
              }}
            />
            <Attachment
              url={data.dotBackUrl as string}
              label="DOT (Back)"
              onUpdate={async (newUrl) => {
                await updateJobApplication(data.id, {
                  dotBackUrl: newUrl,
                });
                queryClient.invalidateQueries({
                  queryKey: ["job-application"],
                });
              }}
            />
            <Attachment
              url={data.socialSecurityFrontUrl as string}
              label="Social Security (Front)"
              onUpdate={async (newUrl) => {
                await updateJobApplication(data.id, {
                  socialSecurityFrontUrl: newUrl,
                });
                queryClient.invalidateQueries({
                  queryKey: ["job-application"],
                });
              }}
            />
            <Attachment
              url={data.socialSecurityBackUrl as string}
              label="Social Security (Back)"
              onUpdate={async (newUrl) => {
                await updateJobApplication(data.id, {
                  drivingLicenseBackUrl: newUrl,
                });
                queryClient.invalidateQueries({
                  queryKey: ["job-application"],
                });
              }}
            />
            <Attachment
              url={data.signatureUrl as string}
              label="Signature"
              onUpdate={async (newUrl) => {
                await updateJobApplication(data.id, {
                  signatureUrl: newUrl,
                });
                queryClient.invalidateQueries({
                  queryKey: ["job-application"],
                });
              }}
            />
            {data.agreementUrl && (
              <Attachment url={data.agreementUrl as string} label="Agreement" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
