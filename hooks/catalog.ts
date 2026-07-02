import {
  CatalogSelectType,
  CatalogViewSelectType,
  ProductSelectType,
} from "@/lib/db/schema";
import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";

export type Catalog = CatalogSelectType & {
  views: CatalogViewSelectType[];
  products: ProductSelectType[];
};
export interface CatalogResponse {
  data: Catalog;
}

export const useCatalog = () => {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: () => {
      return fetcher<CatalogResponse>(`/api/products/catalog`);
    },
    staleTime: 1000 * 60 * 5,
  });
};
