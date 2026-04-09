import { PlusCircle } from "lucide-react";
import { PageClient } from "./page-client";
import { SIDEBAR_MENU } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { CustomerDialog } from "@/components/admin/customer-dialog";
import { CustomerInviteDialog } from "@/components/admin/customer-invite-dialog";

export const metadata = {
  title: "Customers",
};

const TAB_OPTIONS =
  SIDEBAR_MENU.find((i) => i.href === "/admin/customers")?.items ||
  SIDEBAR_MENU[0]["items"];

const CustomersPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <FilterTabs tabs={TAB_OPTIONS} queryKey="customers" />
      <div className="flex gap-4 items-center">
        <SearchBar />
        <div className="flex gap-4 items-center justify-end flex-1">
          <CustomerDialog>
            <Button
              size="xl"
              variant="outline"
              className="rounded-xl size-12 md:w-auto md:px-8 md:min-w-32"
            >
              <PlusCircle />
              <span className="hidden md:inline">Add Customer</span>
            </Button>
          </CustomerDialog>
          <CustomerInviteDialog type="invitation" />
        </div>
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default CustomersPage;
