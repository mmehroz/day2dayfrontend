//@ts-nocheck

import { CheckBox } from "@components/ui/checkbox";
import { useBrandsQuery } from "@framework/brand/get-all-brands";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useProductsQuery } from "@framework/product/get-all-products";

export const BrandFilter = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    isFetching: isLoadingSecondary,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data: dataSecondary,
    error: errorSecondary,
  } = useProductsQuery({ ...router.query });

  console.log("data in brand filter: ", dataSecondary);

  const { pathname, query } = router;
  const { data, isLoading, error } = useBrandsQuery({
    limit: 10,
  });
  const selectedBrands = query?.brand ? (query.brand as string).split(",") : [];
  const [formState, setFormState] = React.useState<string[]>(selectedBrands);
  React.useEffect(() => {
    setFormState(selectedBrands);
  }, [query?.brand]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  function handleItemClick(e: React.FormEvent<HTMLInputElement>): void {
    const { value } = e.currentTarget;
    let currentFormState = formState.includes(value)
      ? formState.filter((i) => i !== value)
      : [...formState, value];
    // setFormState(currentFormState);
    const { brand, ...restQuery } = query;
    router.push(
      {
        pathname,
        query: {
          ...restQuery,
          ...(!!currentFormState.length
            ? { brand: currentFormState.join(",") }
            : {}),
        },
      },
      undefined,
      { scroll: false }
    );
  }

  console.log("data in brands ", data);
  const items = data?.brands;

  const render = () => {
    if (items?.length) {
      return items?.map((item: any) => {
        if (dataSecondary?.pages[0]?.brandname === item.brand_name) {
          return;
        }

        return (
          <CheckBox
            key={item.id}
            label={item.name}
            name={item.name.toLowerCase()}
            checked={formState.includes(item.slug)}
            value={item.slug}
            onChange={() => router?.push(`/product/brands/${item.brand_slug}`)}
          />
        );
      });
    }

    if (data?.length) {
      return data?.map((item, i) => {
        if (dataSecondary?.pages[0]?.brandname === item.brand_name) {
          return;
        }

        return (
          <CheckBox
            key={item.id}
            label={item.brand_name}
            name={item.brand_name.toLowerCase()}
            checked={formState.includes(item.brand_slug)}
            value={item.brand_slug}
            onChange={() => router?.push(`/product/brands/${item.brand_slug}`)}
          />
        );
      });
    }
  };

  return (
    <div className="block border-b border-gray-300 pb-7 mb-7">
      <h3 className="text-heading text-sm md:text-base font-semibold mb-7">
        {t("text-brands")}
      </h3>
      <div className="mt-2 flex flex-col space-y-4">
        {dataSecondary?.pages[0]?.brandname ? (
          <CheckBox
            key={"brand-data"}
            label={dataSecondary?.pages[0]?.brandname}
            name={dataSecondary?.pages[0]?.brandname}
            checked={true}
            value={null}
            onChange={() => {}}
          />
        ) : null}
        {render()}
      </div>
    </div>
  );
};
