import { Plus } from "lucide-react";
import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/admin/search-filters";
import { CustomerDialog } from "./customer-dialog";

export const metadata = {
  title: "Customers",
};

const CustomersPage = async () => {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 ">
        <div className="space-y-1 flex-1">
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer accounts
          </p>
        </div>
        <CustomerDialog>
          <Button size="xl" className="rounded-xl md:order-3 flex-[0_0_1]">
            <Plus /> Add New
          </Button>
        </CustomerDialog>
        <SearchBar className="basis-full max-w-full md:max-w-xs" />
      </div>

      <PageClient />
    </div>
  );
};

export default CustomersPage;
