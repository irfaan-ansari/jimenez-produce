import { PageClient } from "./page-client";
import { FileText, FileUp, Plus, Upload } from "lucide-react";
import { ImportDialog } from "./import-dialog";
import { Button } from "@/components/ui/button";
import { FilterTab } from "@/components/admin/filter-tabs";
import { SearchBar } from "@/components/admin/search-filters";
import { ProductDialog } from "@/components/admin/product-dialog";
import CatalogDialog from "./catalog-dialog";

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
        <CatalogDialog>
          <Button variant="outline" size="xl" className="rounded-xl md:order-3">
            <FileText /> Catalog
          </Button>
        </CatalogDialog>
        <ImportDialog>
          <Button variant="outline" size="xl" className="rounded-xl md:order-3">
            <FileUp /> Import Prices
          </Button>
        </ImportDialog>
        <ProductDialog>
          <Button size="xl" className="rounded-xl md:order-4">
            <Plus />
            Add New
          </Button>
        </ProductDialog>
      </div>
      <div className="flex justify-between items-start">
        <FilterTab tabs={OPTIONS} path="/api/products/count" />
        <SearchBar className="basis-full md:basis-xs md:order-2 max-w-full" />
      </div>

      {/* content */}
      <PageClient />
    </div>
  );
};

export default CatalogPage;
