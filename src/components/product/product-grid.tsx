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
  const { query } = useRouter();
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

  console.log("products state: ", products);

  useEffect(() => {
    if (!data?.pages?.length || products?.length) return;

    //@ts-ignore
    setProducts(data?.pages[0]?.data);

    return () => {
      setProducts([]);
    };
  }, [data]);

  const fetchMore = async () => {
    try {
      const product_id = query?.product_id;
      const type = product_id?.split("=")[0];
      const p_id = product_id?.split("=")[1];
      let endpoint: string = "";

      if (type === "product_id") {
        endpoint = `http://207.244.250.143/day2day/api/product/product_id=${p_id}?page=${
          pages + 1
        }`;
      }

      if (type === "product_sub") {
        endpoint = `http://207.244.250.143/day2day/api/productsub/product_id=${p_id}?page=${
          pages + 1
        }`;
      }

      const res = await axios(endpoint);

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
  console.log(products);
  console.log("data here in component: ", products);
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
      {data?.pages?.length ? (
        <div className="w-full mt-40 justify-center flex">
          <Button
            onClick={fetchMore}
            className=" bg-gradient-to-tr  to-orange-500 from-orange-800"
          >
            Load More
          </Button>
        </div>
      ) : null}

      <div className="text-center pt-8 xl:pt-14">
        {/* {hasNextPage && (
					<Button
						loading={loadingMore}
						disabled={loadingMore}
						onClick={() => fetchNextPage()}
						variant="slim"
						className="bg-gradient-to-r from-orange-500  to-pink-500"
					>
						{t("button-load-more")}
					</Button>
				)} */}
      </div>
    </>
  );
};
