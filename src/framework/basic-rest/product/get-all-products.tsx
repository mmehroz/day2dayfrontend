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

  const { product_id } = queryKey[1];

  if (queryKey[1]?.product_sub) {
    route = `https://portal.day2daywholesale.com/api/productsub/product_id=${queryKey[1]?.product_sub}`;

    const data = queryKey[1]?.product_sub?.toString()?.split("+")?.join(",");

    if (queryKey[1]?.product_sub?.includes("+")) {
      route = `https://portal.day2daywholesale.com/api/getmultifilter?sub_slug=${data}`;
    }

    if (queryKey[1]?.product_sub === "featured-products") {
      route = `https://portal.day2daywholesale.com/api/getsale/type=Featured`;
    }

    if (queryKey[1]?.product_sub === "flash-sale") {
      route = `https://portal.day2daywholesale.com/api/getsale/type=Flash`;
    }

    if (queryKey[1]?.product_sub === "new-arrivals") {
      route = `https://portal.day2daywholesale.com/api/getsale/type=New`;
    }

    if (queryKey[1]?.product_sub === "special-offer") {
      route = `https://portal.day2daywholesale.com/api/getsale/type=Specialoffer`;
    }

    if (queryKey[1]?.product_sub === "special-deal") {
      route = `https://portal.day2daywholesale.com/api/getsale/type=Specialdeal`;
    }
  }

  if (queryKey[1]?.product_inner) {
    route = `https://portal.day2daywholesale.com/api/productinner/product_id=${queryKey[1]?.product_inner}`;

    const data = queryKey[1]?.product_inner?.toString()?.split("+")?.join(",");
    if (queryKey[1]?.product_inner?.includes("+")) {
      route = `https://portal.day2daywholesale.com/api/getmultifilter?inner_slug=${data}`;
    }
  }

  if (queryKey[1]?.product_main) {
    route = `https://portal.day2daywholesale.com/api/product/product_id=${queryKey[1]?.product_main}`;

    const data = queryKey[1]?.product_main?.toString()?.split("+")?.join(",");

    if (queryKey[1]?.product_main?.includes("+")) {
      route = `https://portal.day2daywholesale.com/api/getmultifilter?cat_slug=${data}`;
    }
  }

  if (queryKey[1]?.product_brand) {
    route = `https://portal.day2daywholesale.com/api/brandproduct/brand_id=${queryKey[1]?.product_brand}`;

    if (queryKey[1]?.product_brand?.toString()?.includes("+")) {
      console.log("multi brand slug detected");
      route = `https://portal.day2daywholesale.com/api/getmultibrand?brand_slug=${queryKey[1]?.product_brand
        ?.toString()
        ?.split("+")
        ?.join(",")}`;
    }
  }

  if (queryKey[1]?.tag_product) {
    route = `https://portal.day2daywholesale.com/api/tagproduct/tagname=${queryKey[1]?.tag_product}`;
  }

  route = route
    ? route
    : "https://portal.day2daywholesale.com/api/product/product_id=all";

  const { data } = await http.get(route);

  const obj = {
    haris: {
      name: "haris",
      fatherName: "iqbal",
      age: 12,
    },
  };

  ///@ts-ignore
  obj.haris["age"] = 12;

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
