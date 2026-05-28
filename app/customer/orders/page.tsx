import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { FilterTab } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";

import Link from "next/link";
import { Plus } from "lucide-react";

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
      <div className="flex flex-wrap items-center gap-4 md:flex-nowrap ">
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-bold">Track your orders</h1>
          <p className="text-sm line-clamp-1 text-muted-foreground">
            Clear delivery windows and live order status in one place.
          </p>
        </div>
        <Button
          size="xl"
          className="rounded-xl md:order-3 flex-[0_0_1]"
          asChild
        >
          <Link href="/customer/new-order">
            <Plus /> New Order
          </Link>
        </Button>
        <SearchBar className="max-w-full basis-full md:max-w-xs" />
      </div>

      <FilterTab tabs={OPTIONS} path="/api/customer/orders/count" />
      {/* content */}
      <PageClient />
    </div>
  );
};

export default OrdersPage;
