import ProductCard from "@components/product/product-card";
import Button from "@components/ui/button";
import type { FC } from "react";
import { useProductsQuery } from "@framework/product/get-all-products";
import { useRouter } from "next/router";
import ProductFeedLoader from "@components/ui/loaders/product-feed-loader";
import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import { Product } from "@framework/types";
import axios from "axios";
interface ProductGridProps {
  className?: string;
}
export const ProductGrid: FC<ProductGridProps> = ({ className = "" }) => {
  const router = useRouter();
  const { query } = router;
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState<number>(1);
  const {
    isFetching: isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data,
    error,
  } = useProductsQuery({ limit: 10, ...query });

  useEffect(() => {
    if (!data?.pages?.length || products?.length) return;

    //@ts-ignore
    setProducts(data?.pages[0]?.data);
  }, [data]);

  const fetchMore = async () => {
    try {
      let endpoint = "";

      console.log("query 39: ", query);

      if (router?.pathname === "/products") {
        endpoint = `https://portal.day2daywholesale.com/api/product/product_id=all?page=${
          pages + 1
        }`;
      }

      if (query?.tag_product) {
        endpoint = `https://portal.day2daywholesale.com/api/tagproduct/tagname=${
          query?.tag_product
        }?page=${pages + 1}`;
      }

      if (query?.product_brand) {
        endpoint = `https://portal.day2daywholesale.com/api/brandproduct/brand_id=${
          query?.product_brand
        }?page=${pages + 1}`;
      }

      if (query?.product_sub) {
        endpoint = `https://portal.day2daywholesale.com/api/productsub/product_id=${
          query?.product_sub
        }?page=${pages + 1}`;

        //product-sub-multi
        if (query?.product_sub?.includes("+")) {
          const data = query?.product_sub?.toString()?.split("+")?.join(",");
          endpoint = `http://207.244.250.143/day2day/api/getmultifilter?sub_slug=${data}&page=${
            pages + 1
          }`;
        }
      }

      if (query?.product_inner) {
        endpoint = `https://portal.day2daywholesale.com/api/productinner/product_id=${
          query?.product_inner
        }?page=${pages + 1}`;

        //product-inner
        if (query?.product_inner?.includes("+")) {
          const data = query?.product_inner?.toString()?.split("+")?.join(",");
          endpoint = `http://207.244.250.143/day2day/api/getmultifilter?inner_slug=${data}&page=${
            pages + 1
          }`;
        }
      }
      if (query?.product_main) {
        endpoint = `https://portal.day2daywholesale.com/api/product/product_id=${
          query?.product_main
        }?page=${pages + 1}`;

        //product-main
        if (query?.product_main?.includes("+")) {
          const data = query?.product_main?.toString()?.split("+")?.join(",");
          endpoint = `http://207.244.250.143/day2day/api/getmultifilter?cat_slug=${data}&page=${
            pages + 1
          }`;
        }
      }

      const res = await axios(endpoint);
      console.log(res?.data?.data);
      console.log("response res");

      setPages((prev) => prev + 1);
      setProducts((prev) => prev.concat(res?.data?.data));
    } catch (err) {}
  };

  if (error) return <p>{error.message}</p>;

  const render = () => {
    if (pages < 2) {
      return data?.pages?.map((page) => {
        return page?.data?.map((product) => (
          <ProductCard
            key={`product--key${product.id}`}
            product={product}
            variant="grid"
          />
        ));
      });
    }

    return products.map((product, i) => {
      return (
        <ProductCard
          key={`product--key${product.id}`}
          product={product}
          variant="grid"
        />
      );
    });
  };

  const { t } = useTranslation("common");

  console.log("router: ", router);
  console.log(data);
  console.log("data 95");

  return (
    <>
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 lg:gap-x-5 xl:gap-x-7 gap-y-3 xl:gap-y-5 2xl:gap-y-8 ${className}`}
      >
        {isLoading && !data?.pages?.length ? (
          <ProductFeedLoader limit={20} uniqueKey="search-product" />
        ) : (
          render()
        )}
      </div>
      {data?.pages[0]?.data?.length ? (
        <div className="w-full mt-40 justify-center flex">
          <Button
            onClick={fetchMore}
            className=" bg-gradient-to-tr  to-orange-500 from-orange-800"
          >
            Load More
          </Button>
        </div>
      ) : null}

      <div className="text-center pt-8 xl:pt-14"></div>
    </>
  );
};
