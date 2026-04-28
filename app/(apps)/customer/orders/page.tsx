import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { FilterTab } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";

import Link from "next/link";

export const metadata = {
  title: "New Order",
};

const OPTIONS = [
  { label: "All", value: "" },
  { label: "In Progress", value: "in_progress" },
  { label: "Delayed", value: "delayed" },
  { label: "Completed", value: "completed" },
];

const OrdersPage = async () => {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex w-full items-center gap-4 **:data-[slot=input-group]:bg-background">
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-bold">Track your orders</h1>
          <p className="text-sm text-muted-foreground">
            Clear delivery windows and live order status in one place.
          </p>
        </div>
        <SearchBar />
        <Button size="xl" variant="outline">
          Browse Catalog
        </Button>
        <Button size="xl" className="rounded-xl" asChild>
          <Link href="/customer/orders/new">View Cart (4)</Link>
        </Button>
      </div>
      <FilterTab tabs={OPTIONS} path="/api/teams/orders/count" />
      {/* content */}
      <PageClient />
    </div>
  );
};

export default OrdersPage;
