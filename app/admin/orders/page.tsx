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
    <div className="flex flex-col h-full gap-5">
      <div className="flex w-full flex-wrap md:flex-nowrap items-start gap-x-2 gap-y-4">
        <div className="flex-1 space-y-1">
          <h1 className="text-xl font-bold">Manage orders</h1>
          <p className="text-sm text-muted-foreground">
            View, track, and manage all orders in one place.
          </p>
        </div>
        <Button size="xl" className="rounded-xl md:order-3">
          <Plus /> Draft Order
        </Button>

        <SearchBar className="basis-full max-w-full md:basis-xs md:order-2" />
      </div>

      <FilterTab tabs={OPTIONS} path="/api/orders/count" />
      {/* content */}
      <PageClient />
    </div>
  );
};

export default OrdersPage;
