import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomerDetailsPage = async ({
  params,
}: {
  params: { teamId: string };
}) => {
  const { teamId } = await params;
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
              <Link href="/customer/orders">
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
        <CardContent className="space-y-6 text-base">Recent Orders</CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetailsPage;
