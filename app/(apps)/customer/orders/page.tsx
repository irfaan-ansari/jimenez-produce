import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/admin/filter-tabs";
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
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center gap-4 w-full **:data-[slot=input-group]:bg-background">
        <div className="space-y-1 flex-1">
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
      <FilterTabs tabs={OPTIONS} queryKey="orders" />
      {/* content */}
      <PageClient />
    </div>
  );
};

export default OrdersPage;
