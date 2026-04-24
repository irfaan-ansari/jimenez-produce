import { Plus } from "lucide-react";
import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/admin/search-filters";
import { WarehouseDialog } from "@/components/admin/warehouse-dialog";

export const metadata = {
  title: "Warehouses",
};

const WarehousesPage = async () => {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-center gap-4 *:flex-1">
        <h1 className="text-2xl font-semibold">Warehouses</h1>
        <div className="flex items-center justify-end gap-4">
          <SearchBar />
          <WarehouseDialog>
            <Button size="xl" className="rounded-xl">
              <Plus /> Add New
            </Button>
          </WarehouseDialog>
        </div>
      </div>

      <PageClient />
    </div>
  );
};

export default WarehousesPage;
