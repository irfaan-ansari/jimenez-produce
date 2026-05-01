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
      <div className="justify-betwee flex w-full items-center gap-4">
        <div className="flex flex-1 flex-col">
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-muted-foreground text-sm">
            Manage your products, prices, and inventory.
          </p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <SearchBar />
          <ImportDialog>
            <Button variant="outline" size="xl" className="rounded-xl">
              <Upload /> Import
            </Button>
          </ImportDialog>
          <ProductDialog>
            <Button size="xl" className="rounded-xl">
              <Plus />
              Add New
            </Button>
          </ProductDialog>
        </div>
      </div>

      <FilterTab tabs={OPTIONS} path="/api/products/count" />

      {/* content */}
      <PageClient />
    </div>
  );
};

export default CatalogPage;
