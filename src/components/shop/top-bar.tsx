//@ts-nocheck

import { Drawer } from "@components/common/drawer/drawer";
import FilterIcon from "@components/icons/filter-icon";
import Text from "@components/ui/text";
import { useUI } from "@contexts/ui.context";
import FilterSidebar from "@components/shop/filter-sidebar";
import ListBox from "@components/ui/list-box";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getDirection } from "@utils/get-direction";
import { useProductsQuery } from "@framework/product/get-all-products";
import { useContext } from "react";
import { colorsContext } from "@contexts/colors.context";

const SearchTopBar = () => {
  const { query } = useRouter();
  const {
    isFetching: isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data,
    error,
  } = useProductsQuery({ limit: 10, ...query });

  const { theme } = useContext(colorsContext);

  const { openFilter, displayFilter, closeFilter } = useUI();
  const { t } = useTranslation("common");
  const router = useRouter();

  const dir = getDirection(router?.locale);
  const contentWrapperCSS = dir === "ltr" ? { left: 0 } : { right: 0 };

  return (
    <div className="flex justify-between items-center mb-7">
      <Text
        style={{
          color: theme.textColor,
        }}
        variant="pageHeading"
        className="hidden lg:inline-flex pb-1"
      >
        {data?.pages[0]?.filtername
          ? data?.pages[0]?.filtername
          : data?.pages[0]?.brandname}
      </Text>
      {/* <button
        className="lg:hidden text-heading text-sm px-4 py-2 font-semibold border border-gray-300 rounded-md flex items-center transition duration-200 ease-in-out focus:outline-none hover:bg-gray-200"
        onClick={openFilter}
      >
        <FilterIcon />
        <span className="ps-2.5"></span>
      </button> */}
      <div className="flex items-center justify-end">
        {/* <div className="flex-shrink-0 text-body text-xs md:text-sm leading-4 pe-4 md:me-6 ps-2 hidden lg:block">
          {data?.pages[0]?.data?.length} {t("text-items")}
        </div> */}
        {/* <ListBox
          options={[
            { name: "text-sorting-options", value: "options" },
            { name: "text-newest", value: "newest" },
            { name: "text-popularity", value: "popularity" },
            { name: "text-price-low-high", value: "low-high" },
            { name: "text-price-high-low", value: "high-low" },
          ]}
        /> */}
      </div>
      <Drawer
        placement={dir === "rtl" ? "right" : "left"}
        open={displayFilter}
        onClose={closeFilter}
        handler={false}
        showMask={true}
        level={null}
        contentWrapperStyle={contentWrapperCSS}
      >
        <FilterSidebar />
      </Drawer>
    </div>
  );
};

export default SearchTopBar;
