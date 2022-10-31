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

  console.log("query key 17: ", queryKey);

  if (queryKey[1]?.product_sub) {
    route = `https://portal.day2daywholesale.com/api/productsub/product_id=${queryKey[1]?.product_sub}`;
  }

  if (queryKey[1]?.product_inner) {
    route = `https://portal.day2daywholesale.com/api/productinner/product_id=${queryKey[1]?.product_inner}`;
  }

  if (queryKey[1]?.product_main) {
    route = `https://portal.day2daywholesale.com/api/product/product_id=${queryKey[1]?.product_main}`;
  }

  if (queryKey[1]?.product_brand) {
    route = `https://portal.day2daywholesale.com/api/brandproduct/brand_id=${queryKey[1]?.product_brand}`;
  }

  if (queryKey[1]?.tag_product) {
    route = `https://portal.day2daywholesale.com/api/tagproduct/tagname=${queryKey[1]?.tag_product}`;
  }

  console.log(route);

  route = route
    ? route
    : "https://portal.day2daywholesale.com/api/product/product_id=all";

  console.log("final: ", route);

  const { data } = await http.get(route);
  console.log("im hererer 86");

  console.log("query data: ", data);
  return {
    data: shuffle(data.data),
    paginatorInfo: {
      nextPageUrl: "",
    },
    filtername: data.filtername?.category_name
      ? data.filtername?.category_name
      : data?.filtername,
    brandname: data?.brandname,
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
