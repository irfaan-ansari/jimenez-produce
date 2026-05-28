import { Plus } from "lucide-react";
import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/admin/search-filters";
import { CustomerDialog } from "@/features/admin/components/customer-dialog";

export const metadata = {
  title: "Customers",
};

const CustomersPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex flex-wrap items-center gap-4 md:flex-nowrap ">
        <div className="flex-1 space-y-1">
          <h1 className="text-xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer accounts
          </p>
        </div>
        <CustomerDialog>
          <Button size="xl" className="rounded-xl md:order-3 flex-[0_0_1]">
            <Plus /> Add New
          </Button>
        </CustomerDialog>
        <SearchBar className="max-w-full basis-full md:max-w-xs" />
      </div>

      <PageClient />
    </div>
  );
};

export default CustomersPage;
