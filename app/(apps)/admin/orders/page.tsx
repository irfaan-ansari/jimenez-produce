import { PageClient } from "./page-client";
import { FilterTab } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Orders",
};

const OPTIONS = [
  { label: "All", value: "" },
  { label: "In Progress", value: "in_progress" },
  { label: "Delayed", value: "delayed" },
  { label: "Completed", value: "completed" },
];

const OrdersPage = async () => {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-center justify-between gap-4 *:flex-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Manage orders</h1>
          <p className="text-sm text-muted-foreground">
            View, track, and manage all orders in one place.
          </p>
        </div>
        <div className="flex items-center justify-end gap-4">
          <SearchBar />
          <Button size="xl">
            <Plus /> Draft Order
          </Button>
        </div>
      </div>
      <FilterTab tabs={OPTIONS} path="/api/orders/count" />
      {/* content */}
      <PageClient />
    </div>
  );
};

export default OrdersPage;
