import { PageClient } from "./page-client";
import { FilterTabs } from "@/components/admin/filter-tabs";
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
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <FilterTabs tabs={OPTIONS} queryKey="orders" />
      <div className="flex gap-4 items-center">
        <SearchBar />
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default OrdersPage;
