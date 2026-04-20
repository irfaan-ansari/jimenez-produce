import { Plus } from "lucide-react";
import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { PriceLevelDialog } from "@/components/admin/price-level-dialog";

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
      <h1 className="text-2xl font-semibold">Price Level</h1>

      <FilterTabs tabs={OPTIONS} queryKey="products" />

      <div className="flex gap-4 items-center">
        <SearchBar />

        <PriceLevelDialog>
          <Button size="xl" className="rounded-xl min-w-28 ml-auto">
            <Plus /> Add New
          </Button>
        </PriceLevelDialog>
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default PriceLevelPage;
