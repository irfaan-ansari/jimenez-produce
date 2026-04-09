import { PageClient } from "./page-client";
import { SIDEBAR_MENU_CUSTOMER } from "@/lib/config";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";

export const metadata = {
  title: "Orders",
};

const TAB_OPTIONS =
  SIDEBAR_MENU_CUSTOMER.find(
    (i) => i.href === "/customer/orders"
  )?.items?.filter((i) => i.label !== "New") ||
  SIDEBAR_MENU_CUSTOMER[0]["items"];

const OrdersPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <FilterTabs tabs={TAB_OPTIONS} queryKey="orders" />
      <div className="flex gap-4 items-center">
        <SearchBar />
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default OrdersPage;
