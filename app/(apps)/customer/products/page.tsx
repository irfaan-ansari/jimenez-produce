import { PageClient } from "./page-client";
import { SearchBar } from "@/components/admin/search-filters";

export const metadata = {
  title: "Products",
};

const ProductsPage = async () => {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex justify-between *:flex-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Explore all products</h1>
          <p className="text-sm text-muted-foreground">
            A centralized view of your entire inventory and product
            specifications.
          </p>
        </div>
        <div className="flex items-center justify-end gap-4">
          <SearchBar />
        </div>
      </div>

      {/* content */}
      <PageClient />
    </div>
  );
};

export default ProductsPage;
