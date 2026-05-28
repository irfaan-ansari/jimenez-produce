import { PageClient } from "./page-client";
import { Plus, Upload } from "lucide-react";
import { ImportDialog } from "@/features/admin/components/import-dialog";
import { Button } from "@/components/ui/button";
import { FilterTab } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { ProductDialog } from "@/features/admin/components/product-dialog";

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
      <div className="flex flex-wrap items-center w-full md:flex-nowrap gap-y-4 gap-x-2">
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground line-clamp-1">
            Manage your products, prices, and inventory.
          </p>
        </div>

        <ImportDialog>
          <Button variant="outline" size="xl" className="rounded-xl md:order-3">
            <Upload /> Import
          </Button>
        </ImportDialog>
        <ProductDialog>
          <Button size="xl" className="rounded-xl md:order-4">
            <Plus />
            Add New
          </Button>
        </ProductDialog>
        <SearchBar className="max-w-full basis-full md:basis-xs md:order-2" />
      </div>

      <FilterTab tabs={OPTIONS} path="/api/products/count" />

      {/* content */}
      <PageClient />
    </div>
  );
};

export default CatalogPage;
