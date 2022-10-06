import { QueryOptionsType, Product } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "react-query";

export const fetchFeaturedProducts = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;
  const { data } = await http.get(API_ENDPOINTS.FEATURED_PRODUCTS);
  console.log("featured query: ", data);
  console.log(data?.data);
  return data.data as Product[];
};
export const useFeaturedProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.FEATURED_PRODUCTS, options],
    fetchFeaturedProducts
  );
};
