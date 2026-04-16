import { Plus, Upload } from "lucide-react";
import { PageClient } from "./page-client";
import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { ProductDialog } from "@/components/admin/product-dialog";

export const metadata = {
  title: "Products",
};
const OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Private", value: "private" },
  { label: "Archived", value: "archived" },
];

const CatalogPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Products</h1>

      <FilterTabs tabs={OPTIONS} queryKey="products" />

      <div className="flex gap-4 items-center">
        <SearchBar />

        <Button variant="outline" size="xl" className="rounded-xl ml-auto">
          <Upload /> Import
        </Button>
        <ProductDialog
          trigger={
            <Button size="xl" className="rounded-xl  min-w-32 px-8">
              <Plus />
              Add Product
            </Button>
          }
        />
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default CatalogPage;
