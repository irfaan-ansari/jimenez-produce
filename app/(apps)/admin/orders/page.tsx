import { PageClient } from "./page-client";
import { FilterTab } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";

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
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <SearchBar />
      </div>
      <FilterTab tabs={OPTIONS} path="/api/orders/count" />
      {/* content */}
      <PageClient />
    </div>
  );
};

export default OrdersPage;
