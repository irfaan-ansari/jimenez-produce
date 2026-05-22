import { Plus } from "lucide-react";
import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { FilterTab } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { PriceLevelDialog } from "@/app/(apps)/admin/products/price-level/price-level-dialog";

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
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-wrap md:flex-nowrap items-center gap-y-4 gap-x-2">
        <div className="flex-1 space-y-1">
          <h1 className="text-xl font-bold">Prices</h1>
          <p className="text-sm text-muted-foreground">
            Manage price level settings.
          </p>
        </div>

        <PriceLevelDialog>
          <Button size="xl" className="min-w-28 rounded-xl md:order-3">
            <Plus /> Add New
          </Button>
        </PriceLevelDialog>
        <SearchBar className="basis-full max-w-full md:max-w-xs" />
      </div>

      <FilterTab tabs={OPTIONS} path="/api/price-level/count" />

      {/* content */}
      <PageClient />
    </div>
  );
};

export default PriceLevelPage;
