//@ts-nocheck

import { useCategoriesQuery } from "@framework/category/get-all-categories";
import { CheckBox } from "@components/ui/checkbox";
import { useRouter } from "next/router";
import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "next-i18next";
import axios from "axios";
import { colorsContext } from "@contexts/colors.context";

export const CategoryFilter = ({ currentCategory }: any) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [href, setHref] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { theme } = useContext(colorsContext);

  useEffect(() => {
    let subscribe: boolean = false;
    if (subscribe) return;
    let id, postType;

    setHref(router?.asPath);

    if (
      router?.query?.product_sub?.includes("+") ||
      router?.query?.product_main?.includes("+")
    ) {
      const data =
        router?.query?.product_sub?.toString()?.split("+") ??
        router?.query?.product_main?.toString()?.split("+");
      setSelectedCategories(data);
    }

    if (router?.query?.product_main) {
      postType = "parent";
      id = router?.query?.product_main;
    }

    if (router?.query?.product_sub) {
      postType = "child";
      id = router?.query?.product_sub;
    }

    if (router?.query?.product_inner) {
      postType = "sub";
      id = router?.query?.product_inner;
    }

    if (router?.query?.product_brand) {
      postType = "parent";
      id = "ashtrays";
    }

    axios("https://portal.day2daywholesale.com/api/subnav", {
      method: "POST",
      data: {
        category_id: id,
        type: postType,
      },
    })
      .then((res) => {
        setCategories(res?.data?.subnav);
      })
      .catch((err) => {});

    return () => {
      subscribe = true;
    };
  }, [router?.query]);

  console.log("current category: ", currentCategory);

  return (
    <div
      className="block border-b border-gray-300 pb-7 mb-7"
    >
      <h3 className=" text-sm md:text-base font-semibold mb-7">
        {t("text-category")}
      </h3>
      <div className="mt-2 flex flex-col space-y-4 h-[10rem] overflow-y-scroll">
        
        {categories?.map((el, i) => {
          if (
            el?.subcategory_name === currentCategory ||
            el?.category_name === currentCategory ||
            el?.subcategory_name === "Multi Product"
          ) {
            return;
          }
          return (
            <CheckBox
              key={i}
              label={el?.subcategory_name || el?.category_name}
              label={el?.subcategory_name || el?.category_name}
              checked={selectedCategories?.find(
                (sl, i) => sl === el.subcategory_slug || sl === el.category_slug
              )}
              value={el?.subcategory_slug || el?.category_slug}
              onChange={() => {
                router?.push(
                  `${href}+${el.category_slug || el.subcategory_slug}`
                );
                return;
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
