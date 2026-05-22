import { PageClient } from "./page-client";
import { Plus, Upload } from "lucide-react";
import { ImportDialog } from "./import-dialog";
import { Button } from "@/components/ui/button";
import { FilterTab } from "@/components/admin/filter-tabs";
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
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-wrap md:flex-nowrap w-full items-center gap-y-4 gap-x-2">
        <div className="flex flex-1 flex-col">
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm line-clamp-1">
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
        <SearchBar className="basis-full md:basis-xs md:order-2 max-w-full" />
      </div>

      <FilterTab tabs={OPTIONS} path="/api/products/count" />

      {/* content */}
      <PageClient />
    </div>
  );
};

export default CatalogPage;
