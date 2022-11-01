//@ts-nocheck

import { useCategoriesQuery } from "@framework/category/get-all-categories";
import { CheckBox } from "@components/ui/checkbox";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import axios from "axios";

export const CategoryFilter = ({ currentCategory }: any) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [href, setHref] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    let subscribe: boolean = false;
    if (subscribe) return;
    let id, postType;

    console.log("router query: ", router?.asPath);
    setHref(router?.asPath);
    console.log("router query 24: ", router?.query);
    if (
      router?.query?.product_sub?.includes("+") ||
      router?.query?.product_main?.includes("+")
    ) {
      console.log(router?.query?.product_sub);
      console.log("router query product_sub");
      console.log(router?.query?.product_sub?.toString()?.split("+"));
      const data =
        router?.query?.product_sub?.toString()?.split("+") ??
        router?.query?.product_main?.toString()?.split("+");
      console.log("data 33: ", data);
      setSelectedCategories(data);
    }

    if (router?.query?.product_main) {
      postType = "parent";
      id = router?.query?.product_main;
    }

    if (router?.query?.product_sub) {
      postType = "child";
      id = router?.query?.product_sub;

      console.log("im herererer");
      console.log("href: ", href);
    }

    if (router?.query?.product_inner) {
      postType = "sub";
      id = router?.query?.product_inner;
    }

    if (router?.query?.product_brand) {
      postType = "parent";
      id = "ashtrays";
    }

    axios("http://207.244.250.143/day2day/api/subnav", {
      method: "POST",
      data: {
        category_id: id,
        type: postType,
      },
    })
      .then((res) => {
        setCategories(res?.data?.subnav);
        console.log("category response: ", res);
      })
      .catch((err) => {
        console.log("error: ", err);
      });

    return () => {
      subscribe = true;
    };
  }, [router?.query]);

  console.log("78 selected categories: ", selectedCategories);

  return (
    <div className="block border-b border-gray-300 pb-7 mb-7">
      <h3 className="text-heading text-sm md:text-base font-semibold mb-7">
        {t("text-category")}
      </h3>
      <div className="mt-2 flex flex-col space-y-4">
        {currentCategory?.length
          ? currentCategory !== "Multi Product" && (
              <CheckBox
                key={1}
                label={currentCategory}
                name={currentCategory}
                checked={currentCategory?.length >= 1}
                value={""}
                onChange={() => {}}
              />
            )
          : null}
        {categories?.map((el, i) => {
          console.log("all categories: ", categories);
          if (
            el?.subcategory_name === currentCategory ||
            el?.category_name === currentCategory
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
