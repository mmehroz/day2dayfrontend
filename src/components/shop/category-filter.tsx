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

  useEffect(() => {
    let subscribe: boolean = false;
    if (subscribe) return;

    if (!router?.query?.product_id) return;

    const product_id = router?.query?.product_id;
    console.log(product_id);
    console.log("product_id 21: ", product_id);
    let id = product_id?.split("=")[1];
    const type = product_id?.split("=")[0];
    console.log("type 24: ", type);
    let postType;

    if (type === "product_sub") {
      postType = "child";
    }

    if (type === "product_inner") {
      postType = "sub";
    }

    if (type === "product_id") {
      postType = "parent";
    }

    if (type === "brand-id") {
      postType = "parent";
      id = 1;
    }

    console.log("current category: ", currentCategory);

    axios("http://portal.day2daywholesale.com/api/subnav", {
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

    console.log("parsed id for category: ", id);

    return () => {
      subscribe = true;
    };
  }, [router?.query]);

  return (
    <div className="block border-b border-gray-300 pb-7 mb-7">
      <h3 className="text-heading text-sm md:text-base font-semibold mb-7">
        {t("text-category")}
      </h3>
      <div className="mt-2 flex flex-col space-y-4">
        {currentCategory?.length ? (
          <CheckBox
            key={1}
            label={currentCategory}
            name={currentCategory}
            checked={currentCategory?.length >= 1}
            value={""}
            onChange={() => {}}
          />
        ) : null}
        {categories?.map((el, i) => {
          return (
            <CheckBox
              key={i}
              label={el?.subcategory_name}
              label={el?.subcategory_name}
              checked={false}
              value={el?.subcategory_slug}
              onChange={() => {
                router?.push(`/product/product_sub=${el?.id}`);
                return;
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
