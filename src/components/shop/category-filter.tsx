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
  const [stateClicked, setStateClicked] = useState(false);

  useEffect(() => {
    let subscribe: boolean = false;
    if (subscribe) return;
    let id, postType;
    console.log(router?.query);

    setHref(router?.asPath);

    if (
      router?.query?.subcat?.includes("+") ||
      router?.query?.maincat?.includes("+")
    ) {
      const data =
        router?.query?.subcat?.toString()?.split("+") ??
        router?.query?.maincat?.toString()?.split("+");
      setSelectedCategories(data);
    }

    if (router?.query?.maincat) {
      postType = "parent";
      id = router?.query?.maincat;
    }

    if (router?.query?.subcat) {
      postType = "child";
      id = router?.query?.subcat;
    }

    if (router?.query?.innercat) {
      postType = "sub";
      id = router?.query?.innercat;
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

  const handleRoute = (el) => {
    // const categoryClicked = localStorage.getItem("categoryClicked");
    // setStateClicked(true);

    // if (categoryClicked === "0") {
    //   let path = "/product/";

    //   if (router?.query?.maincat) {
    //     path = `/product/${router?.query?.maincat}/${el?.subcategory_slug}`;
    //   }

    //   if (router?.query?.subcat) {
    //     path = `/product/${router?.query?.maincat}/${router?.query?.subcat}/${el?.subcategory_slug}`;
    //   }

    //   if (router?.query?.innercat) {
    //     path = `/product/${router?.query?.maincat}/${router?.query?.subcat}/${router?.query?.innercat}`;
    //   }

    //   console.log("path: ", path);
    //   console.log("el: ", el);

    //   localStorage.setItem("categoryClicked", "1");
    //   router?.push(path);
    //   return;
    // }
    if (
      router?.query?.subcat?.toString()?.includes("+") ||
      router?.query?.maincat?.toString()?.includes("+") ||
      router?.query?.innercat?.toString()?.includes("+")
    ) {
      console.log("im here 81");
      let parsedSlug;
      let isDat;
      let val;

      if (router?.query?.maincat?.toString()?.includes("+")) {
        val = router?.query?.maincat?.toString()?.split("+");
      }

      if (router?.query?.subcat?.toString()?.includes("+")) {
        val = router?.query?.subcat?.toString()?.split("+");
      }

      if (router?.query?.innercat?.toString()?.includes("+")) {
        val = router?.query?.innercat?.toString()?.split("+");
      }

      console.log("value 90: ", val);

      if (router?.query?.maincat && !router?.query?.subcat) {
        isDat = val?.find((vl, i) => vl === el?.category_slug);
      }

      if (router?.query?.subcat || router?.query?.innercat) {
        isDat = val?.find((vl, i) => vl === el?.subcategory_slug);
      }

      if (router?.query?.maincat) {
        parsedSlug = val?.filter((pl, i) => pl !== el?.category_slug);
      }

      if (router?.query?.subcat || router?.query?.innercat) {
        parsedSlug = val?.filter((pl, i) => pl !== el?.subcategory_slug);
      }

      console.log("isDat: ", isDat);
      console.log("parsed slug: ", parsedSlug);

      if (isDat) {
        console.log("parsed slug 107: ", parsedSlug);

        if (router?.query?.innercat) {
          router?.push(
            `/product/${router?.query?.maincat}/${
              router?.query?.subcat
            }/${parsedSlug?.join("+")}`
          );

          return;
        }

        if (router?.query?.subcat) {
          router?.push(
            `/product/${router?.query?.maincat}/${parsedSlug?.join("+")}`
          );

          return;
        }

        if (router?.query?.maincat) {
          router?.push(`/product/${parsedSlug?.join("+")}`);
        }

        console.log("parsed slug 107: ", parsedSlug);
        console.log("data: ", val);
        console.log("isDat: ", isDat);
        console.log("category: ", el);
        return;
      }

      if (router?.query?.innercat?.includes("+")) {
        console.log("154");
        console.log(router?.query);

        router?.push(
          `/product/${router?.query?.maincat}/${
            router?.query?.subcat
          }/${parsedSlug?.join("+")}`
        );

        return;
      }

      if (router?.query?.subcat?.includes("+")) {
        router?.push(
          `/product/${router?.query?.maincat}/${parsedSlug?.join("+")}+${
            el?.subcategory_slug
          }`
        );
        console.log("im herere");
        console.log(parsedSlug);
        console.log("parsed slug");
        return;
      }

      if (router?.query?.maincat?.includes("+")) {
        router?.push(`/product/${parsedSlug?.join("+")}+${el?.category_slug}`);
      }

      return;
    }

    router?.push(`${href}+${el.category_slug || el.subcategory_slug}`);
  };

  return (
    <div className="block border-b border-gray-300 pb-7 mb-7">
      <h3 className=" text-sm md:text-base font-semibold mb-7">
        {t("text-category")}
      </h3>
      <div className="mt-2 flex flex-col space-y-4 h-[10rem] overflow-y-scroll">
        {categories?.map((el, i) => {
          return (
            <CheckBox
              key={i}
              label={el?.subcategory_name || el?.category_name}
              label={el?.subcategory_name || el?.category_name}
              checked={selectedCategories?.find(
                (sl, i) => sl === el.subcategory_slug || sl === el.category_slug
              )}
              value={el?.subcategory_slug || el?.category_slug}
              onChange={() => handleRoute(el)}
            />
          );
        })}
      </div>
    </div>
  );
};
