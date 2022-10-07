import { QueryOptionsType, Product } from "@framework/types";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import shuffle from "lodash/shuffle";
import { useInfiniteQuery } from "react-query";
type PaginatedProduct = {
  data: Product[];
  paginatorInfo: any;
};
const fetchProducts = async ({ queryKey }: any) => {
  let route = "";
  const [_key, _params] = queryKey;
  console.log(queryKey);
  console.log("query key");
  const { product_id } = queryKey[1];

  if (product_id?.toString()?.includes("product_id")) {
    route = `http://207.244.250.143/day2day/api/product/${product_id}`;
  }

  if (product_id?.toString()?.includes("product_sub")) {
    const id = product_id?.split("=")[1];

    route = `http://207.244.250.143/day2day/api/productsub/product_id=${id}`;
  }

  if (product_id?.toString()?.includes("product_inner")) {
    const id = product_id?.split("=")[1];

    route = `http://207.244.250.143/day2day/api/productinner/product_id=${id}`;
  }

  console.log(route);
  console.log("route");

  const { data } = await http.get(route);

  console.log("query data: ", data);
  return {
    data: shuffle(data.data),
    paginatorInfo: {
      nextPageUrl: "",
    },
    filtername: data.filtername,
  };
};

const useProductsQuery = (options: QueryOptionsType) => {
  return useInfiniteQuery<PaginatedProduct, Error>(
    [API_ENDPOINTS.PRO, options],
    fetchProducts,
    {
      getNextPageParam: ({ paginatorInfo }) => paginatorInfo.nextPageUrl,
    }
  );
};

export { useProductsQuery, fetchProducts };
