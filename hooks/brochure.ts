import {
  CatalogSelectType,
  CatalogViewSelectType,
  ProductSelectType,
} from "@/lib/db/schema";
import { Pagination } from "@/lib/types";
import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";

export type Brochure = CatalogSelectType & {
  views: CatalogViewSelectType[];
  products: ProductSelectType[];
};
export interface BrochureResponse {
  data: Brochure[];
  pagination: Pagination;
}

export const useBrochures = (query?: Record<string, string>) => {
  const url = new URLSearchParams(query).toString();
  return useQuery({
    queryKey: ["brochures", query],
    queryFn: () => {
      return fetcher<BrochureResponse>(`/api/products/brochures?${url}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};
