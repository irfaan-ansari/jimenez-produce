"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User } from "lucide-react";
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

export const PageClient = ({ params }: { params: Promise<{ id: string }> }) => {
  const param = use(params);
  const {
    data: result,
    isPending,
    error,
    isError,
  } = useJobApplication(Number(param.id));

  // loading
  if (isPending) return <LoadingSkeleton />;

  // error
  if (isError) {
    return <EmptyComponent variant="error" title={error.message} />;
  }

  const { data } = result;

  const status = jobApplicationStatusMap[data?.status as JobApplicationStatus];

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
            {data.firstName}
          </h1>
          {/* action button */}
          <JobApplicationAction
            id={data.id}
            status={data.status as JobApplicationStatus}
            showView={false}
          />
        </div>
        {/* applicant details */}
        <Card className="rounded-2xl text-base">
          <CardHeader className="flex gap-4 flex-row items-start border-b">
            <Badge
              variant="secondary"
              className="size-12 rounded-xl [&>svg]:size-5!"
            >
              <User />
            </Badge>
            <div className="space-y-0.5">
              <CardTitle className="text-xl font-semibold">
                {data.firstName + " " + data.lastName}
              </CardTitle>
              <div className="text-muted-foreground">{data.position}</div>
            </div>
            <Badge
              variant="outline"
              style={{ "--color": status.color } as React.CSSProperties}
              className="ml-auto h-7 rounded-xl pl-1.5 pr-2.5 gap-1.5 [&>svg]:size-3.5! bg-(--color)/10 border-(--color)/10 text-sm"
            >
              <status.icon className="text-(--color)" />

              {status.label}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-4 items-start justify-between">
              <div className="text-muted-foreground">Phone</div>
              <div>{data.phone}</div>
            </div>
            <div className="flex gap-4 items-start justify-between">
              <div className="text-muted-foreground">Email</div>
              <div>{data.email}</div>
            </div>
            <div className="flex gap-4 items-start justify-between">
              <div className="text-muted-foreground">Date of Birth</div>
              <div>{data.dob}</div>
            </div>
            <div className="flex gap-4 items-start justify-between">
              <div className="text-muted-foreground">Availability</div>
              <div>{data.availableStartDate}</div>
            </div>
            <div className="flex gap-4 items-start justify-between">
              <div className="text-muted-foreground">Social Security #</div>
              <div className="capitalize">{data.availableStartDate}</div>
            </div>
            <div className="flex gap-4 items-start justify-between">
              <div className="text-muted-foreground">
                Eligible to Work in the U.S.
              </div>
              <div className="capitalize">{data.hasLegalRights}</div>
            </div>
          </CardContent>
        </Card>

        {/* education details */}
        <Card className="rounded-2xl text-base">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold">Collage</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="text-muted-foreground textsm">
                Institution Name
              </div>
              <div>{data.collage?.institutionName}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground textsm">Field of Study</div>
              <div>{data.collage?.fieldOfStudy}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground textsm">Location</div>
              <div>{data.collage?.location}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground textsm">Year Completed</div>
              <div>{data.collage?.yearCompleted}</div>
            </div>
            <div className="space-y-1 col-span-2">
              <div className="text-muted-foreground textsm">Details</div>
              <div>{data.collage?.details}</div>
            </div>
          </CardContent>
          <CardHeader className="border-y py-6">
            <CardTitle className="text-xl font-semibold">High School</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="text-muted-foreground textsm">
                Institution Name
              </div>
              <div>{data.highSchool?.institutionName}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground textsm">Field of Study</div>
              <div>{data.highSchool?.fieldOfStudy}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground textsm">Location</div>
              <div>{data.highSchool?.location}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground textsm">Year Completed</div>
              <div>{data.highSchool?.yearCompleted}</div>
            </div>
            <div className="space-y-1 col-span-2">
              <div className="text-muted-foreground textsm">Details</div>
              <div>{data.highSchool?.details}</div>
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
                      <div className="text-muted-foreground textsm">
                        Institution Name
                      </div>
                      <div>{edu?.institutionName}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground textsm">
                        Field of Study
                      </div>
                      <div>{edu?.fieldOfStudy}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground textsm">
                        Location
                      </div>
                      <div>{edu?.location}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground textsm">
                        Year Completed
                      </div>
                      <div>{edu?.yearCompleted}</div>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <div className="text-muted-foreground textsm">
                        Details
                      </div>
                      <div>{edu?.details}</div>
                    </div>
                  </CardContent>
                ))}
              </>
            )}
        </Card>

        {/* employement details */}
        {Array.isArray(data.experience) && data.experience.length > 0 && (
          <Card className="rounded-2xl text-base">
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
                  <div className="text-muted-foreground textsm">
                    Employer Name
                  </div>
                  <div>{emp.employerName}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground textsm">
                    Employer Phone
                  </div>
                  <div>{emp.phone}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground textsm">
                    Employer Address
                  </div>
                  <div>{emp.address}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground textsm">Position</div>
                  <div>{emp.position}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground textsm">Duration</div>
                  <div>{emp.fromDate + " - " + emp.toDate}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground textsm">Salary</div>
                  <div>{emp.salary}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground textsm">
                    FMCSR Applied
                  </div>
                  <div className="capitalize">{emp.safetySensitive}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground textsm">
                    Safety-Sensitive (DOT)
                  </div>
                  <div className="capitalize">{emp.subjectToFmcsa}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground textsm">
                    Reason for Leaving
                  </div>
                  <div>{emp.reasonForLeaving}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground textsm">
                    Explain eny Gaps
                  </div>
                  <div>{emp.gap}</div>
                </div>
              </CardContent>
            ))}
          </Card>
        )}

        {/* address */}
        <Card className="rounded-2xl text-base">
          {/* current address */}
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold">
              Current Address
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6 border-b pb-6">
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">Street</div>
              <div>{data.currentAddress.street}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">City</div>
              <div>{data.currentAddress.city}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">State</div>
              <div>{data.currentAddress.state}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">Zip</div>
              <div>{data.currentAddress.zip}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">
                Years at Address
              </div>
              <div>{data.currentAddress.yearsAtAddress}</div>
            </div>
          </CardContent>
          {/* mailing address */}
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold">
              Mailing Address
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6 not-last:border-b not-last:pb-6">
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">Street</div>
              <div>{data.mailingAddress.street}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">City</div>
              <div>{data.mailingAddress.city}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">State</div>
              <div>{data.mailingAddress.state}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">Zip</div>
              <div>{data.mailingAddress.zip}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">
                Years at Address
              </div>
              <div>{data.mailingAddress.yearsAtAddress}</div>
            </div>
          </CardContent>
          {/* addresses */}
          {Array.isArray(data.addresses) && data.addresses.length > 0 && (
            <>
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-semibold">
                  Addresses
                </CardTitle>
              </CardHeader>

              {data.addresses.map((add, i) => (
                <CardContent
                  key={i}
                  className="grid grid-cols-2 gap-6 not-last:pb-6 not-last:boredr-b"
                >
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm">Street</div>
                    <div>{add.street}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm">City</div>
                    <div>{add.city}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm">State</div>
                    <div>{add.state}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm">Zip</div>
                    <div>{add.zip}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm">
                      Years at Address
                    </div>
                    <div>{add.yearsAtAddress}</div>
                  </div>
                </CardContent>
              ))}
            </>
          )}
        </Card>

        {/* license */}
        <Card className="rounded-2xl text-base">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold">
              Current License
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6 not-last:pb-6 not-last:border-b">
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">License #</div>
              <div>{data.currentLicense?.licenseNumber}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">Type/Class</div>
              <div>{data.currentLicense?.licenseType}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">Expiry Date</div>
              <div>{data.currentLicense?.expiryDate}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">Endorsements</div>
              <div>{data.currentLicense?.endorsements}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">Issuing State</div>
              <div>{data.currentLicense?.state}</div>
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
                    <div className="text-muted-foreground text-sm">
                      License #
                    </div>
                    <div>{lic.licenseNumber}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm">
                      Type/Class
                    </div>
                    <div>{lic.licenseType}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm">
                      Expiry Date
                    </div>
                    <div>{lic.expiryDate}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm">
                      Endorsements
                    </div>
                    <div>{lic.endorsements}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-sm">
                      Issuing State
                    </div>
                    <div>{lic.state}</div>
                  </div>
                </CardContent>
              ))}
            </>
          )}
        </Card>

        {/* driving experience */}
        {Array.isArray(data.drivingExperiences) &&
          data.drivingExperiences.length > 0 && (
            <>
              <Card className="rounded-2xl text-base">
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
                      <div className="text-muted-foreground text-sm">
                        Category
                      </div>
                      <div>{exp.category}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">Type</div>
                      <div>{exp.type}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        Duration
                      </div>
                      <div>{exp.fromDate + "-" + exp.toDate}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        Approx Miles Total
                      </div>
                      <div>{exp.approxMilesTotal}</div>
                    </div>
                  </CardContent>
                ))}
              </Card>
            </>
          )}

        {/* accident history */}
        {Array.isArray(data.accidentHistory) &&
          data.accidentHistory.length > 0 && (
            <>
              <Card className="rounded-2xl text-base">
                <CardHeader className="border-b">
                  <CardTitle className="text-xl font-semibold">
                    Accident History
                  </CardTitle>
                </CardHeader>
                {data.accidentHistory.map((acc, i) => (
                  <CardContent className="grid grid-cols-2 gap-6 not-last:pb-6 not-last:border-b">
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">Date</div>
                      <div>{acc.accidentDate}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        Nature
                      </div>
                      <div>{acc.accidentNature}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        Injuries Count
                      </div>
                      <div>{acc.injuriesCount}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        Fetalities Count
                      </div>
                      <div>{acc.fatalitiesCount}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        Chemical Spill
                      </div>
                      <div>{acc.chemicalSpill}</div>
                    </div>
                  </CardContent>
                ))}
              </Card>
            </>
          )}

        {/* traffic convictions*/}
        {Array.isArray(data.trafficConvictions) &&
          data.trafficConvictions.length > 0 && (
            <>
              <Card className="rounded-2xl text-base">
                <CardHeader className="border-b">
                  <CardTitle className="text-xl font-semibold">
                    Accident History
                  </CardTitle>
                </CardHeader>
                {data.trafficConvictions.map((tc, i) => (
                  <CardContent className="grid grid-cols-2 gap-6 not-last:pb-6 not-last:border-b">
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">Date</div>
                      <div>{tc.dateConvicted}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        Violation
                      </div>
                      <div>{tc.violation}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        Location
                      </div>
                      <div>{tc.state}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        Penalty
                      </div>
                      <div>{tc.penalty}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        License Ever Denied
                      </div>
                      <div>{tc.licenseDenied}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        Reason for License Denial
                      </div>
                      <div>{tc.licenseDeniedReason}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        License Ever Suspended
                      </div>
                      <div>{tc.licenseSuspended}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-sm">
                        Reason for Suspension
                      </div>
                      <div>{tc.licenseSuspendedReason}</div>
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
          <CardContent className="space-y-2">
            {data.reviewedAt && (
              <div>
                <span className="mr-1 inline-block text-muted-foreground">
                  Reviewed At:
                </span>
                {format(data.reviewedAt!, "dd-mm-yyyy hh:mm:ss a")}
              </div>
            )}
            <div>
              <span className="mr-1 inline-block text-muted-foreground">
                Created At:
              </span>
              {format(data.createdAt!, "dd-mm-yyyy hh:mm:ss a")}
            </div>
            <div>
              <span className="mr-1 inline-block text-muted-foreground">
                Updated At:
              </span>
              {format(data.updatedAt!, "dd-mm-yyyy hh:mm:ss a")}
            </div>
            <div>
              <span className="mr-1 inline-block text-muted-foreground">
                IP Address:
              </span>
              {data?.ipAddress}
            </div>
            <div>
              <span className="mr-1 inline-block text-muted-foreground">
                User Agent:
              </span>
              {data?.userAgent}
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
            />
            <Attachment
              url={data.drivingLicenseBackUrl as string}
              label="Driving License (Front)"
            />
            <Attachment url={data.dotFrontUrl as string} label="DOT (Front)" />
            <Attachment url={data.dotBackUrl as string} label="DOT (Back)" />
            <Attachment
              url={data.socialSecurityFrontUrl as string}
              label="Social Security (Front)"
            />
            <Attachment
              url={data.socialSecurityBackUrl as string}
              label="Social Security (Back)"
            />
            <Attachment url={data.signatureUrl as string} label="Signature" />
            <Attachment url={data.agreementUrl as string} label="Agreement" />
            <Attachment
              url={data.agreementSignatureUrl as string}
              label="Agreement Signature"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
