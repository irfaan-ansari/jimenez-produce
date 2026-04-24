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
      <div className="flex items-center gap-4 *:flex-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Manage Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer accounts and information.
          </p>
        </div>
        <div className="flex items-center justify-end gap-4">
          <SearchBar />
          <CustomerDialog>
            <Button size="xl" className="rounded-xl">
              <Plus /> Add New
            </Button>
          </CustomerDialog>
        </div>
      </div>

      <PageClient />
    </div>
  );
};

export default CustomersPage;
