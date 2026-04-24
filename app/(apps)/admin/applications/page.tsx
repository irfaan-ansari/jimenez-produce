import { Plus, PlusCircle } from "lucide-react";
import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { CustomerDialog } from "@/components/admin/customer-dialog";
import { CustomerInviteDialog } from "@/components/admin/customer-invite-dialog";

export const metadata = {
  title: "Customers",
};

const OPTIONS = [
  { label: "All", value: "" },
  { label: "New", value: "new" },
  { label: "Under Review", value: "under_review" },
  { label: "Approved", value: "active" },
  { label: "On Hold", value: "on_hold" },
  { label: "Rejected", value: "rejected" },
];

const CustomersPage = async () => {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex gap-4 justify-between *:flex-1">
        <h1 className="text-2xl font-bold">Customer applications</h1>
        <div className="flex items-center gap-4">
          <SearchBar />
          <div className="flex flex-1 items-center justify-end gap-4">
            <CustomerInviteDialog type="invitation" />
            <CustomerDialog>
              <Button size="xl" className="rounded-xl">
                <Plus />
                Add New
              </Button>
            </CustomerDialog>
          </div>
        </div>
      </div>
      <FilterTabs tabs={OPTIONS} queryKey="customers" />
      {/* content */}
      <PageClient />
    </div>
  );
};

export default CustomersPage;
