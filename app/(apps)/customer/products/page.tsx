import { PageClient } from "./page-client";
import { SearchBar } from "@/components/admin/search-filters";

export const metadata = {
  title: "Products",
};

const ProductsPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex justify-between *:flex-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Browse our wide range of products
          </p>
        </div>
        <div className="flex gap-4 items-center justify-end">
          <SearchBar />
        </div>
      </div>

      {/* content */}
      <PageClient />
    </div>
  );
};

export default ProductsPage;
