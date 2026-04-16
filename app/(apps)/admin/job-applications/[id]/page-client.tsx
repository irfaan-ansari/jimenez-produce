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

  const thumbnail = `https://api.dicebear.com/9.x/initials/svg?seed=${data.firstName}`;
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
            <Link href="/admin/job-applications">
              <ChevronLeft /> Back
            </Link>
          </Button>
          <h1 className="text-xl font-semibold flex-1 truncate">
            {data.applicantName}
          </h1>
          {/* action button */}
          <JobApplicationAction showView={false} initialValues={data} />
        </div>
        {/* applicant details */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row gap-4">
            <Avatar className="shrink-0 after:hidden size-12 ring-2 rounded-xl **:rounded-xl ring-offset-1 ring-(--color)/30 relative">
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
                Applicant Name
              </p>
              <p className="text-base">
                {data.firstName} {data.lastName}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">DOB</p>
              <p className="text-base">{format(data.dob, "MMMM dd, yyyy")}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Available Date
              </p>
              <p className="text-base">
                {format(data.availableStartDate, "MMMM dd, yyyy")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Social Security #
              </p>
              <p className="text-base">{data.socialSecurity}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Work Authorization
              </p>
              <p className="text-base capitalize">{data.hasLegalRights}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Contact Details
              </p>
              <div className="space-y-1">
                <div className="flex gap-2 items-center flex-nowrap">
                  <Phone className="size-4 shrink-0" />
                  <span>{data.phone}</span>
                </div>
                <span className="h-4 w-0.5 bg-foreground/20"></span>
                <div className="flex gap-2 items-center flex-nowrap">
                  <MailCheck className="size-4 shrink-0" />
                  <span>{data.email}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
                Current Address
              </p>
              <p className="text-base">
                {data.currentAddress.street} {data.currentAddress.city}{" "}
                {data.currentAddress.state} {data.currentAddress.zip}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase font-medium">
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

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-muted-foreground uppercase font-medium">
                Name
              </div>
              <div className="text-base">{data.collage?.institutionName}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground textsm">School</div>
              <div className="text-base">{data.collage?.fieldOfStudy}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground textsm">Location</div>
              <div className="text-base">{data.collage?.location}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground textsm">Year Completed</div>
              <div className="text-base">{data.collage?.yearCompleted}</div>
            </div>
            <div className="space-y-1 col-span-2">
              <div className="text-muted-foreground textsm">Details</div>
              <div className="text-base">{data.collage?.details}</div>
            </div>
          </CardContent>

          <CardContent className="grid grid-cols-2 gap-6 border-t pt-6">
            <div className="space-y-2">
              <div className="text-muted-foreground uppercase font-medium">
                Institution Name
              </div>
              <div className="text-base">{data.collage?.institutionName}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground uppercase font-medium">
                Field of Study
              </div>
              <div className="text-base">{data.collage?.fieldOfStudy}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground uppercase font-medium">
                Location
              </div>
              <div className="text-base">{data.collage?.location}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground uppercase font-medium">
                Year Completed
              </div>
              <div className="text-base">{data.collage?.yearCompleted}</div>
            </div>
            <div className="space-y-1 col-span-2">
              <div className="text-muted-foreground uppercase font-medium">
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
                    className="grid grid-cols-2 gap-6 not-last:pb-6 not-last:border-b"
                    key={i}
                  >
                    <div className="space-y-1">
                      <div className="text-muted-foreground uppercase font-medium">
                        Institution Name
                      </div>
                      <div className="text-base">{edu?.institutionName}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground uppercase font-medium">
                        Field of Study
                      </div>
                      <div className="text-base">{edu?.fieldOfStudy}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground uppercase font-medium">
                        Location
                      </div>
                      <div className="text-base">{edu?.location}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground uppercase font-medium">
                        Year Completed
                      </div>
                      <div className="text-base">{edu?.yearCompleted}</div>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <div className="text-muted-foreground uppercase font-medium">
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
                className="grid grid-cols-2 gap-6 not-last:pb-6 not-last:border-b"
              >
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
                    Employer Name
                  </div>
                  <div className="text-base">{emp.employerName}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
                    Employer Phone
                  </div>
                  <div className="text-base">{emp.phone}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
                    Employer Address
                  </div>
                  <div className="text-base">{emp.address}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
                    Position
                  </div>
                  <div className="text-base">{emp.position}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
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
                  <div className="text-muted-foreground uppercase font-medium">
                    Salary
                  </div>
                  <div className="text-base">{emp.salary}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
                    FMCSA Applied
                  </div>
                  <div className="capitalize">{emp.safetySensitive}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
                    Safety-Sensitive (DOT)
                  </div>
                  <div className="capitalize">{emp.subjectToFmcsa}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
                    Reason for Leaving
                  </div>
                  <div className="text-base">{emp.reasonForLeaving}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
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
                className="grid grid-cols-2 gap-6 not-last:pb-6 not-last:boredr-b"
              >
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
                    Street
                  </div>
                  <div className="text-base">{add.street}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
                    City
                  </div>
                  <div className="text-base">{add.city}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
                    State
                  </div>
                  <div className="text-base">{add.state}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
                    Zip
                  </div>
                  <div className="text-base">{add.zip}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground uppercase font-medium">
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
          <CardContent className="grid grid-cols-2 gap-6 not-last:pb-6 not-last:border-b">
            <div className="space-y-1">
              <div className="text-muted-foreground uppercase font-medium">
                License #
              </div>
              <div className="text-base">
                {data.currentLicense?.licenseNumber}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground uppercase font-medium">
                Type/Class
              </div>
              <div className="text-base">
                {data.currentLicense?.licenseType}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground uppercase font-medium">
                Expiry Date
              </div>
              <div className="text-base">
                {data.currentLicense?.expiryDate
                  ? format(data.currentLicense?.expiryDate, "MMMM dd, yyyy")
                  : ""}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground uppercase font-medium">
                Endorsements
              </div>
              <div className="text-base">
                {data.currentLicense?.endorsements}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground uppercase font-medium">
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
                  className="grid grid-cols-2 gap-6 not-last:pb-6 not-last:border-b"
                >
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
                      License #
                    </div>
                    <div className="text-base">{lic.licenseNumber}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
                      Type/Class
                    </div>
                    <div className="text-base">{lic.licenseType}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
                      Expiry Date
                    </div>
                    <div className="text-base"> {lic.expiryDate}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
                      Endorsements
                    </div>
                    <div>{lic.endorsements}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
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
                  className="grid grid-cols-2 gap-6 not-last:pb-6 not-last:border-b"
                >
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
                      Category
                    </div>
                    <div className="text-base">{exp.category}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
                      Type
                    </div>
                    <div className="text-base">{exp.type}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
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
                    <div className="text-muted-foreground uppercase font-medium">
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
                <CardContent className="grid grid-cols-2 gap-6 not-last:pb-6 not-last:border-b">
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
                      Date
                    </div>
                    <div className="text-base">{acc.accidentDate}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
                      Nature
                    </div>
                    <div className="text-base">{acc.accidentNature}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
                      Injuries Count
                    </div>
                    <div className="text-base">{acc.injuriesCount}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
                      Fatalities Count
                    </div>
                    <div className="text-base">{acc.fatalitiesCount}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground uppercase font-medium">
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
                  <CardContent className="grid grid-cols-2 gap-6 not-last:pb-6 not-last:border-b">
                    <div className="space-y-1">
                      <div className="text-muted-foreground uppercase font-medium">
                        Date
                      </div>
                      <div className="text-base"> {tc.dateConvicted}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground uppercase font-medium">
                        Violation
                      </div>
                      <div className="text-base">{tc.violation}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground uppercase font-medium">
                        Location
                      </div>
                      <div className="text-base">{tc.state}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground uppercase font-medium">
                        Penalty
                      </div>
                      <div className="text-base">{tc.penalty}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground uppercase font-medium">
                        License Ever Denied
                      </div>
                      <div className="text-base">{tc.licenseDenied}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground uppercase font-medium">
                        Reason for License Denial
                      </div>
                      <div className="text-base">{tc.licenseDeniedReason}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground uppercase font-medium">
                        License Ever Suspended
                      </div>
                      <div className="text-base">{tc.licenseSuspended}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground uppercase font-medium">
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
              <div className="text-muted-foreground uppercase font-medium">
                Created At:
              </div>
              <span className="text-base">
                {format(data.createdAt!, "MMMM dd, yyyy hh:mm:ss a")}
              </span>
            </div>
            <div>
              <div className="text-muted-foreground uppercase font-medium">
                Updated At:
              </div>
              <span className="text-base">
                {format(data.updatedAt!, "MMMM dd, yyyy hh:mm:ss a")}
              </span>
            </div>
            <div>
              <div className="text-muted-foreground uppercase font-medium">
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
        <Card className="rounded-2xl text-base sticky top-6 bg-sidebar">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Notes</CardTitle>
          </CardHeader>
          <CardContent className="border-b min-h-32 whitespace-pre">
            {data.internalNotes}
          </CardContent>

          {data.status === "rejected" && (
            <>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Rejection Reason
                </CardTitle>
              </CardHeader>
              <CardContent className="border-b min-h-32 whitespace-pre">
                {data.statusReason}
              </CardContent>
            </>
          )}
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="border-b divide-y">
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
