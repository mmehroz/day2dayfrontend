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
  const [prevCategories, setPrevCategories] = useState([]);

  useEffect(() => {
    let subscribe: boolean = false;
    if (subscribe) return;
    let id, postType, prevPost, prevPostId;
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
      if (!router?.query?.subcat) {
        prevPostId = "main";
      }
    }

    if (router?.query?.subcat) {
      postType = "child";
      id = router?.query?.subcat;

      if (!router?.query?.innercat) {
        prevPost = "parent";
        prevPostId = router?.query?.maincat;
      }
    }

    if (router?.query?.innercat) {
      postType = "sub";
      id = router?.query?.innercat;
      prevPost = "child";
      prevPostId = router?.query?.subcat;
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

    if (prevPostId === "main") {
      //@ts-ignore
      setPrevCategories([
        {
          id: 1,
          subcategory_name: "Smoke Shop",
          subcategory_slug: "smoke-shop",
          category_id: 1,
        },
        {
          id: 2,
          subcategory_name: "Devices",
          subcategory_slug: "devices",
          category_id: 2,
        },
        {
          id: 3,
          subcategory_name: "Disposable Vapes",
          subcategory_slug: "disposable-vapes",
          category_id: 3,
        },
        {
          id: 4,
          subcategory_name: "E Liquids",
          subcategory_slug: "e-liquids",
          category_id: 4,
        },
        {
          id: 5,
          subcategory_name: "Accessories",
          subcategory_slug: "accessories",
          category_id: 5,
        },
      ]);
      return;
    }

    axios("https://portal.day2daywholesale.com/api/subnav", {
      method: "POST",
      data: {
        category_id: prevPostId,
        type: prevPost,
      },
    })
      .then((res) => {
        setPrevCategories(res?.data?.subnav);
      })
      .catch((err) => {});

    return () => {
      subscribe = true;
    };
  }, [router?.query]);

  console.log("current category: ", currentCategory);

  const handleRoute = (el) => {
    console.log(el);
    console.log("subcategoriess 138");
    if (
      el?.subcategory_slug === "smoke-shop" ||
      el?.subcategory_slug === "devices" ||
      el?.subcategory_slug === "disposable-vapes" ||
      el?.subcategory_slug === "e-liquids" ||
      el?.subcategory_slug === "accessories"
    ) {
      router?.push(`/product/${el?.subcategory_slug}`);
      return;
    }

    let path = "";
    if (router?.query?.maincat?.length) {
      path = `/product/${router?.query?.maincat}/${el?.subcategory_slug}`;
    }

    if (router?.query?.subcat?.length) {
      path = `/product/${router?.query?.maincat}/${router?.query?.subcat}/${el?.subcategory_slug}`;
    }

    if (router?.query?.innercat?.length) {
      path = `/product/${router?.query?.maincat}/${router?.query?.subcat}/${el?.subcategory_slug}`;
    }

    router?.push(path);

    // if (router?.query?.maincat?.toString()?.length) {
    //   console.log(router?.query);
    //   console.log("router query");
    //   if (!router?.query?.subcat) {
    //     if (!router?.query?.innercat) {
    //       router?.push(
    //         `/product/${router?.query?.maincat}/${el?.subcategory_slug}`
    //       );
    //       return;
    //     }

    //     return;
    //   }
    // }

    // if (
    //   router?.query?.subcat?.toString()?.includes("+") ||
    //   router?.query?.maincat?.toString()?.includes("+") ||
    //   router?.query?.innercat?.toString()?.includes("+")
    // ) {
    //   console.log("im here 81");
    //   let parsedSlug;
    //   let isDat;
    //   let val;

    //   if (router?.query?.maincat?.toString()?.includes("+")) {
    //     val = router?.query?.maincat?.toString()?.split("+");
    //   }

    //   if (router?.query?.subcat?.toString()?.includes("+")) {
    //     val = router?.query?.subcat?.toString()?.split("+");
    //   }

    //   if (router?.query?.innercat?.toString()?.includes("+")) {
    //     val = router?.query?.innercat?.toString()?.split("+");
    //   }

    //   console.log("value 90: ", val);

    //   if (router?.query?.maincat && !router?.query?.subcat) {
    //     isDat = val?.find((vl, i) => vl === el?.category_slug);
    //   }

    //   if (router?.query?.subcat || router?.query?.innercat) {
    //     isDat = val?.find((vl, i) => vl === el?.subcategory_slug);
    //   }

    //   if (router?.query?.maincat) {
    //     parsedSlug = val?.filter((pl, i) => pl !== el?.category_slug);
    //   }

    //   if (router?.query?.subcat || router?.query?.innercat) {
    //     parsedSlug = val?.filter((pl, i) => pl !== el?.subcategory_slug);
    //   }

    //   console.log("isDat: ", isDat);
    //   console.log("parsed slug: ", parsedSlug);

    //   if (isDat) {
    //     console.log("parsed slug 107: ", parsedSlug);

    //     if (router?.query?.innercat) {
    //       router?.push(
    //         `/product/${router?.query?.maincat}/${
    //           router?.query?.subcat
    //         }/${parsedSlug?.join("+")}`
    //       );

    //       return;
    //     }

    //     if (router?.query?.subcat) {
    //       router?.push(
    //         `/product/${router?.query?.maincat}/${parsedSlug?.join("+")}`
    //       );

    //       return;
    //     }

    //     if (router?.query?.maincat) {
    //       router?.push(`/product/${parsedSlug?.join("+")}`);
    //     }

    //     console.log("parsed slug 107: ", parsedSlug);
    //     console.log("data: ", val);
    //     console.log("isDat: ", isDat);
    //     console.log("category: ", el);
    //     return;
    //   }

    //   if (router?.query?.innercat?.includes("+")) {
    //     console.log("154");
    //     console.log(router?.query);

    //     router?.push(
    //       `/product/${router?.query?.maincat}/${
    //         router?.query?.subcat
    //       }/${parsedSlug?.join("+")}`
    //     );

    //     return;
    //   }

    //   if (router?.query?.subcat?.includes("+")) {
    //     router?.push(
    //       `/product/${router?.query?.maincat}/${parsedSlug?.join("+")}+${
    //         el?.subcategory_slug
    //       }`
    //     );
    //     console.log("im herere");
    //     console.log(parsedSlug);
    //     console.log("parsed slug");
    //     return;
    //   }

    //   if (router?.query?.maincat?.includes("+")) {
    //     router?.push(`/product/${parsedSlug?.join("+")}+${el?.category_slug}`);
    //   }

    //   return;
    // }

    // router?.push(`${href}+${el.category_slug || el.subcategory_slug}`);
  };

  return (
    <>
      <div className="block border-b border-gray-300 pb-7 mb-7">
        <h3 className=" text-sm md:text-base font-semibold mb-7">
          {t("Category")}
        </h3>
        <div className="mt-2 flex flex-col space-y-4 h-[10rem] overflow-y-scroll">
          {prevCategories?.map((el, i) => {
            return (
              <CheckBox
                key={i}
                label={el?.subcategory_name || el?.category_name}
                label={el?.subcategory_name || el?.category_name}
                value={el?.subcategory_slug || el?.category_slug}
                onChange={() => handleRoute(el)}
              />
            );
          })}
        </div>
      </div>
      <div className="block border-b border-gray-300 pb-7 mb-7">
        <h3 className=" text-sm md:text-base font-semibold mb-7">
          {t("Sub Category")}
        </h3>
        <div className="mt-2 flex flex-col space-y-4 h-[10rem] overflow-y-scroll">
          {categories?.map((el, i) => {
            return (
              <CheckBox
                key={i}
                label={el?.subcategory_name || el?.category_name}
                label={el?.subcategory_name || el?.category_name}
                value={el?.subcategory_slug || el?.category_slug}
                onChange={() => handleRoute(el)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
