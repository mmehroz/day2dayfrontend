import { useState, useContext } from "react";
import Link from "@components/ui/link";
import { siteSettings } from "@settings/site-settings";
import Scrollbar from "@components/common/scrollbar";
import { IoIosArrowDown } from "react-icons/io";
import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import {
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoYoutube,
  IoClose,
} from "react-icons/io5";
import { useTranslation } from "next-i18next";
import React from "react";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useRouter } from "next/router";
import { colorsContext } from "@contexts/colors.context";

const social = [
  {
    id: 0,
    link: "https://www.facebook.com/",
    icon: <IoLogoFacebook />,
    className: "facebook",
    title: "text-facebook",
  },
  {
    id: 1,
    link: "https://twitter.com/",
    icon: <IoLogoTwitter />,
    className: "twitter",
    title: "text-twitter",
  },
  {
    id: 2,
    link: "https://www.youtube.com/",
    icon: <IoLogoYoutube />,
    className: "youtube",
    title: "text-youtube",
  },
  {
    id: 3,
    link: "https://www.instagram.com/",
    icon: <IoLogoInstagram />,
    className: "instagram",
    title: "text-instagram",
  },
];

export default function MobileMenu() {
  const [activeMenus, setActiveMenus] = useState<any>([]);
  const { site_header } = siteSettings;
  const router = useRouter();
  const { theme } = useContext(colorsContext);

  const { closeSidebar } = useUI();
  const { t } = useTranslation("menu");

  const handleArrowClick = (menuName: string) => {
    let newActiveMenus = [...activeMenus];

    if (newActiveMenus.includes(menuName)) {
      var index = newActiveMenus.indexOf(menuName);
      if (index > -1) {
        newActiveMenus.splice(index, 1);
      }
    } else {
      newActiveMenus.push(menuName);
    }

    setActiveMenus(newActiveMenus);
  };

  const ListMenu = ({
    dept,
    data,
    hasSubMenu,
    menuName,
    menuIndex,
    className = "",
  }: any): JSX.Element =>
    data.category_name ? (
      <li
        style={{
          color: theme.textColor,
        }}
        className={`mb-0.5 ${className}`}
      >
        <div className="flex items-center justify-between relative">
          <Link
            href={`/product/product-main/${data?.category_slug}`}
            className="w-full text-[15px] menu-item relative py-3 ps-5 md:ps-6 pe-4 transition duration-300 ease-in-out"
          >
            <span className="block w-full" onClick={closeSidebar}>
              {t(`${data.category_name}`)}
            </span>
          </Link>
          {hasSubMenu && (
            <div
              className="cursor-pointer w-full h-full  text-lg flex items-center justify-end absolute start-0 top-0 pe-5"
              onClick={() => handleArrowClick(menuName)}
            >
              <IoIosArrowDown
                style={{}}
                className={`transition duration-200 ease-in-out transform ${
                  activeMenus.includes(menuName) ? "-rotate-180" : "rotate-0"
                }`}
              />
            </div>
          )}
        </div>
        {hasSubMenu && (
          <SubMenu
            dept={dept}
            data={data.subMenu}
            toggle={activeMenus.includes(menuName)}
            menuIndex={menuIndex}
          />
        )}
      </li>
    ) : (
      data?.subcategory_name && (
        <li className={`mb-0.5 ${className}`}>
          <div className="flex items-center justify-between relative  ">
            <Link
              href={`/product/product-sub/${data?.subcategory_slug}`}
              className="w-full text-[15px] menu-item relative py-3 ps-5 md:ps-6 pe-4 transition duration-300 ease-in-out"
            >
              <span
                className="block w-full"
                onClick={() => {
                  closeSidebar();
                }}
              >
                {data.subcategory_name}
              </span>
            </Link>
            {data?.inner && (
              <div
                className="cursor-pointer w-full h-full  text-lg flex items-center justify-end absolute start-0 top-0 pe-5"
                onClick={() => handleArrowClick(menuName)}
              >
                <IoIosArrowDown
                  className={`transition duration-200 ease-in-out transform ${
                    activeMenus.includes(menuName) ? "-rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            )}
          </div>
          {activeMenus.includes(menuName) && (
            <Link
              href={`/product/product-sub/${data?.subcategory_slug}`}
              className="w-full text-[15px] p-1"
            >
              <span className="block w-full px-9 font-semibold">
                {t(`${data.subcategory_name}`)}
              </span>
            </Link>
          )}
          {data?.inner && (
            <>
              <SubMenu
                dept={dept}
                data={data.inner}
                toggle={activeMenus.includes(menuName)}
                menuIndex={menuIndex}
              />
            </>
          )}
        </li>
      )
    );

  const SubMenu = ({ dept, data, toggle, menuIndex }: any) => {
    if (!toggle) {
      return null;
    }

    dept = dept + 1;

    return (
      <ul className="pt-0.5">
        {data?.map((menu: any, index: number) => {
          const menuName: string = `sidebar-submenu-${dept}-${menuIndex}-${index}`;

          return (
            <>
              <ListMenu
                dept={dept}
                data={menu}
                hasSubMenu={menu.subMenu}
                menuName={menuName}
                key={menuName}
                menuIndex={index}
                className={dept > 1 && "ps-4"}
              />
            </>
          );
        })}
      </ul>
    );
  };

  const [nevdata, setParentNavData] = React.useState([]);

  React.useEffect(() => {
    http.get(API_ENDPOINTS.MENU).then((response) => {
      setParentNavData(response.data.menu);
    });
  }, []);

  const renderData = () => {
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

    return arr.map((menu, index) => {
      const dept: number = 1;
      const menuName: string = `sidebar-menu-${dept}-${index}`;

      return (
        <ListMenu
          dept={dept}
          data={menu}
          hasSubMenu={menu.subMenu?.length > 0 ? true : false}
          menuName={menuName}
          key={menuName}
          menuIndex={index}
          className={dept > 1 && "ps-4"}
        />
      );
    });
  };

  return (
    <>
      <div className="flex flex-col justify-between w-full h-full ">
        <div
          style={{
            borderColor: theme.borderColor,
            backgroundColor: theme.backgroundColorSecondary,
          }}
          className="w-full border-b  flex justify-between items-center relative ps-5 md:ps-7 flex-shrink-0 py-0.5"
        >
          <Logo />

          <button
            className="flex text-2xl items-center justify-center  px-4 md:px-6 py-6 lg:py-8 focus:outline-none transition-opacity hover:opacity-60"
            onClick={closeSidebar}
            aria-label="close"
          >
            <IoClose className="mt-1 md:mt-0.5" />
          </button>
        </div>

        <Scrollbar
          style={{
            backgroundColor: theme.backgroundColorSecondary,
            color: theme.textColor,
          }}
          className="menu-scrollbar flex-grow mb-auto"
        >
          <div className="flex flex-col py-7 px-0 lg:px-2">
            <ul className="mobileMenu">{renderData()}</ul>
          </div>
        </Scrollbar>

        <div
          style={{
            backgroundColor: theme.backgroundColorSecondary,
            color: theme.textColor,
            borderColor: theme.borderColor,
          }}
          className="flex items-center justify-center   border-t px-7 flex-shrink-0 space-s-1"
        >
          {social?.map((item, index) => (
            <a
              href={item.link}
              className={`p-5 opacity-60  first:-ms-4 transition duration-300 ease-in hover:opacity-100 ${item.className}`}
              target="_blank"
              key={index}
            >
              <span className="sr-only">{t(`${item.title}`)}</span>
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
