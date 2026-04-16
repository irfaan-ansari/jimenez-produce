import { Plus } from "lucide-react";
import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { SIDEBAR_MENU_CUSTOMER } from "@/lib/config";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";

import Link from "next/link";

export const metadata = {
  title: "New Order",
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
        <div className="flex gap-4 items-center justify-end flex-1">
          <Button
            size="xl"
            className="rounded-xl size-12 md:w-auto md:px-8 md:min-w-32"
            asChild
          >
            <Link href="/customer/orders/new">
              <Plus />
              New Order
            </Link>
          </Button>
        </div>
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default OrdersPage;
