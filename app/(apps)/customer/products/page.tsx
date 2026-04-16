import { PageClient } from "./page-client";
import { SearchBar } from "@/components/admin/search-filters";

export const metadata = {
  title: "Products",
};

const ProductsPage = async () => {
  return (
    <div className="flex flex-col h-full gap-5">
      <h1 className="text-2xl font-semibold">Products</h1>

      <div className="flex gap-4 items-center">
        <SearchBar />
        {/* add category filter */}
      </div>
      {/* content */}
      <PageClient />
    </div>
  );
};

export default ProductsPage;
