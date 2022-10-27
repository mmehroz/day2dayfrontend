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

  if (
    product_id?.toString()?.includes("product_id") &&
    product_id?.toString() !== "product_id=sales"
  ) {
    route = `https://portal.day2daywholesale.com/api/product/${product_id}`;
  }

  if (product_id?.toString()?.includes("product_sub")) {
    const id = product_id?.split("=")[1];

    route = `https://portal.day2daywholesale.com/api/productsub/product_id=${id}`;
  }

  if (product_id?.toString()?.includes("product_inner")) {
    const id = product_id?.split("=")[1];

    route = `https://portal.day2daywholesale.com/api/productinner/product_id=${id}`;
  }

  if (product_id?.toString()?.includes("brand-id")) {
    const id = product_id.split("=")[1];

    route = `https://portal.day2daywholesale.com/api/brandproduct/brand_id=${id}`;
  }

  // console.log("productid: ", product_id);

  if (product_id === "product_id=sales") {
    route = "https://portal.day2daywholesale.com/api/getsale/type=all";
  }

  if (product_id === "product_sub=1000") {
    route = `https://portal.day2daywholesale.com/api/getsale/type=featured`;
  }

  if (product_id === "product_sub=1001") {
    route = `https://portal.day2daywholesale.com/api/getsale/type=flash`;
  }
  if (product_id === "product_sub=1003") {
    route = "https://portal.day2daywholesale.com/api/getsale/type=new";
  }

  if (product_id === "product_sub=1004") {
    route = "https://portal.day2daywholesale.com/api/getsale/type=Specialoffer";
  }

  if (product_id === "product_sub=1005") {
    route = "https://portal.day2daywholesale.com/api/getsale/type=Specialdeal";
  }

  console.log(route);

  route = route
    ? route
    : "https://portal.day2daywholesale.com/api/product/product_id=all";

  console.log("final: ", route);

  const { data } = await http.get(route);

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
