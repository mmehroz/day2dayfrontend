//@ts-nocheck

import Link from "@components/ui/link";
import { FaChevronDown } from "react-icons/fa";
import MegaMenu from "@components/ui/mega-menu";
import classNames from "classnames";
import ListMenu from "@components/ui/list-menu";
import { useTranslation } from "next-i18next";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import React, { useContext } from "react";
import http from "@framework/utils/http";
import { colorsContext } from "@contexts/colors.context";

const salesData = [
  {
    category_icon: null,
    category_image: "default.jpg",
    category_name: "Sales",
    category_slug: "sales",
    id: "sales",
    subMenu: [
      {
        category_id: 1000,
        id: 1000,
        subcategory_name: "Featured Products",
        subcategory_slug: "featured-products",
        inner: [],
      },
      {
        category_id: 1001,
        id: 1001,
        subcategory_name: "Flash Sale",
        subcategory_slug: "flash-sale",
        inner: [],
      },
      {
        category_id: 1003,
        id: 1003,
        subcategory_name: "New Arrivals",
        subcategory_slug: "new-arrivals",
        inner: [],
      },
      {
        category_id: 1004,
        id: 1004,
        subcategory_name: "Special Offer",
        subcategory_slug: "special-offer",
        inner: [],
      },
      {
        category_id: 1005,
        id: 1005,
        subcategory_name: "Special Deal",
        subcategory_slug: "special-deal",
        inner: [],
      },
    ],
  },
];

interface MenuProps {
  data: any;
  className?: string;
}

const HeaderMenu: React.FC<MenuProps> = ({ className }) => {
  const { theme } = useContext(colorsContext);
  const { t } = useTranslation("menu");

  const [nevdata, setParentNavData] = React.useState([]);
  React.useEffect(() => {
    http.get(API_ENDPOINTS.MENU).then((response) => {
      setParentNavData(response.data.menu);
    });
  }, []);

  const arr = nevdata?.map((el, i) => {
    const menu = el?.subMenu?.sort((a, b) =>
      a?.subcategory_name
        ?.toString()
        ?.localeCompare(b?.subcategory_name?.toString())
    );
    return {
      ...el,
      subMenu: menu,
    };
  });

  return (
    <nav className={classNames(`headerMenu flex w-full relative`, className)}>
      {arr?.map((item: any, i: number) => {
        if (!item?.subMenu?.length) return;

        return (
          <div
            className={`menuItem group cursor-pointer py-7 ${
              item.subMenu ? "relative" : ""
            }`}
            key={item.category_id}
          >
            <Link
              href={`/product/product-main/${item.category_slug}`}
              className="inline-flex items-center text-sm xl:text-base px-3 xl:px-4 py-2 font-normal relative "
            >
              {t(item.category_name)}
              {item?.inner || item.subMenu ? (
                <span className="opacity-30 text-xs mt-1 xl:mt-0.5 w-4 flex justify-end">
                  <FaChevronDown
                    style={{
                      color: theme.textColor,
                    }}
                    className="transition duration-300 ease-in-out transform group-hover:-rotate-180"
                  />
                </span>
              ) : null}
            </Link>

            {/* {item?.subMenu && Array.isArray(item.subMenu) && (
            <MegaMenu subMenu={item.subMenu} />
          )} */}

            {item?.subMenu && Array.isArray(item.subMenu) ? (
              <div className="subMenu shadow-header  absolute start-0 opacity-0 group-hover:opacity-100 ">
                <ul
                  style={{
                    color: theme.textColor,
                    backgroundColor: theme.backgroundColorSecondary,
                  }}
                  className=" text-sm py-5 h-[25rem] overflow-y-scroll  overflow-x-hidden hidescrollbar "
                >
                  {item.subMenu.map((menu: any, index: number) => {
                    const dept: number = 1;
                    const menuName: string = `sidebar-menu-${dept}-${index}`;

                    return (
                      <ListMenu
                        dept={dept}
                        data={menu}
                        hasSubMenu={menu.inner}
                        menuName={menuName}
                        key={menuName}
                        menuIndex={index}
                      />
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        );
      })}

      {salesData?.map((item: any) => {
        if (!item?.subMenu?.length) return;
        return (
          <div
            className={`menuItem group cursor-pointer py-7 ${
              item.subMenu ? "relative" : ""
            }`}
            style={{}}
            key={item.category_id}
          >
            <Link
              href={`/product/product-main/${item.category_slug}`}
              className="inline-flex items-center text-sm xl:text-base  px-3 xl:px-4 py-2 font-normal relative "
            >
              {t(item.category_name)}
              {item?.inner || item.subMenu ? (
                <span className="opacity-30 text-xs mt-1 xl:mt-0.5 w-4 flex justify-end">
                  <FaChevronDown
                    style={{
                      color: theme.textColor,
                    }}
                    className="transition duration-300 ease-in-out transform group-hover:-rotate-180"
                  />
                </span>
              ) : null}
            </Link>

            {/* {item?.subMenu && Array.isArray(item.subMenu) && (
            <MegaMenu subMenu={item.subMenu} />
          )} */}

            {item?.subMenu && Array.isArray(item.subMenu) ? (
              <div
                style={{
                  backgroundColor: theme.backgroundColorSecondary,
                  color: theme.textColor,
                }}
                className="subMenu shadow-header  absolute start-0 opacity-0 group-hover:opacity-100 "
              >
                <ul className=" text-sm py-5 h-[25rem] overflow-y-scroll  overflow-x-hidden hidescrollbar ">
                  {item.subMenu.map((menu: any, index: number) => {
                    const dept: number = 1;
                    const menuName: string = `sidebar-menu-${dept}-${index}`;

                    return (
                      <ListMenu
                        dept={dept}
                        data={menu}
                        hasSubMenu={menu.inner}
                        menuName={menuName}
                        key={menuName}
                        menuIndex={index}
                      />
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
};

export default HeaderMenu;
