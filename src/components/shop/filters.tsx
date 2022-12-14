//@ts-nocheck

import { CategoryFilter } from "./category-filter";
import { BrandFilter } from "./brand-filter";
import { FilteredItem } from "./filtered-item";
import { ColorFilter } from "./color-filter";
import { PriceFilter } from "./price-filter";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "next-i18next";
import { useProductsQuery } from "@framework/product/get-all-products";
import { useContext } from "react";
import { colorsContext } from "@contexts/colors.context";

export const ShopFilters: React.FC = () => {
  const router = useRouter();
  const {
    isFetching: isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data,
    error,
  } = useProductsQuery({ limit: 10, ...router?.query });
  const { theme } = useContext(colorsContext);

  const { pathname, query } = router;
  const { t } = useTranslation("common");

  return (
    <div
      style={{
        color: theme.textColor,
      }}
      className="pt-1"
    >
      {/* <div className="block border-b border-gray-300 pb-7 mb-7">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-semibold  text-xl md:text-2xl">
            {t("text-filters")}
          </h2>
          <button
            className="flex-shrink text-xs mt-0.5 transition duration-150 ease-in focus:outline-none hover:text-heading"
            aria-label="Clear All"
            onClick={() => {
              router.push("/");
            }}
          >
            {t("text-clear-all")}
          </button>
        </div>
        <div className="flex flex-wrap -m-1.5 pt-2">
          {!isEmpty(query) &&
            Object.values(query)
              .join("+" || ",")
              .split("+" || ",")
              .map((v, idx) => (
                <FilteredItem itemKey={v} itemValue={v} key={idx} />
              ))}
        </div>
      </div> */}

      <CategoryFilter currentCategory={data?.pages[0]?.filtername} />
      <BrandFilter />
    </div>
  );
};
