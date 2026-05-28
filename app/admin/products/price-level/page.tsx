import { Import, Plus } from "lucide-react";
import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { FilterTab } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { PriceLevelDialog } from "@/features/admin/components/price-level-dialog";
import { PriceLevelImportDialog } from "@/features/admin/components/pricelevel-import-dialog";

export const metadata = {
  title: "Price Level",
};

const OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const PriceLevelPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex flex-wrap items-center md:flex-nowrap gap-y-4 gap-x-2">
        <div className="flex-1 space-y-1">
          <h1 className="text-xl font-bold">Prices</h1>
          <p className="text-sm text-muted-foreground">
            Manage price level settings.
          </p>
        </div>
        <PriceLevelImportDialog>
          <Button
            size="xl"
            variant="outline"
            className="min-w-28 rounded-xl md:order-3"
          >
            <Import /> Import
          </Button>
        </PriceLevelImportDialog>
        <PriceLevelDialog>
          <Button size="xl" className="min-w-28 rounded-xl md:order-3">
            <Plus /> Add New
          </Button>
        </PriceLevelDialog>
        <SearchBar className="max-w-full basis-full md:max-w-xs" />
      </div>

      <FilterTab tabs={OPTIONS} path="/api/price-level/count" />

      {/* content */}
      <PageClient />
    </div>
  );
};

export default PriceLevelPage;
