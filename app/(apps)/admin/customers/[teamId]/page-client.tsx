import Link from "next/link";

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PageClient = ({ teamId }: { teamId: string }) => {
  return (
    <div className="grid grid-cols-6 gap-8">
      <div className="col-span-6 space-y-6 lg:col-span-4">
        {/* page header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              asChild
              variant="outline"
              className="shrink-0 rounded-xl"
            >
              <Link href="/admin/customers/">
                <ChevronLeft /> Back
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">#{teamId}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button size="lg">Invite Member</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex gap-4 flex-row items-center">
              <CardTitle>Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">100</p>
              <p className="text-sm text-muted-foreground">last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <CardTitle>Completed Orders</CardTitle>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="col-span-2 rounded-2xl bg-card">
        <CardHeader>
          <CardTitle className="font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-base">
          <Timeline defaultValue={2} className="w-full max-w-md">
            <TimelineItem step={1}>
              <TimelineHeader>
                <TimelineDate>March 2024</TimelineDate>
                <TimelineTitle>Project Initialized</TimelineTitle>
              </TimelineHeader>
              <TimelineIndicator />
              <TimelineSeparator />
              <TimelineContent>
                Successfully set up the project repository and initial
                architecture.
              </TimelineContent>
            </TimelineItem>
            <TimelineItem step={2}>
              <TimelineHeader>
                <TimelineDate>April 2024</TimelineDate>
                <TimelineTitle>Beta Release</TimelineTitle>
              </TimelineHeader>
              <TimelineIndicator />
              <TimelineSeparator />
              <TimelineContent>
                Launched the beta version for early testers and feedback.
              </TimelineContent>
            </TimelineItem>
            <TimelineItem step={3}>
              <TimelineHeader>
                <TimelineDate>June 2024</TimelineDate>
                <TimelineTitle>Official Launch</TimelineTitle>
              </TimelineHeader>
              <TimelineIndicator />
              <TimelineSeparator />
              <TimelineContent>
                The platform is now live for all users worldwide.
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card>
    </div>
  );
};
