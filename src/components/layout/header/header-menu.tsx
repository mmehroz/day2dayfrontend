import Link from "@components/ui/link";
import { FaChevronDown } from "react-icons/fa";
import MegaMenu from "@components/ui/mega-menu";
import classNames from "classnames";
import ListMenu from "@components/ui/list-menu";
import { useTranslation } from "next-i18next";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import React from "react";
import http from "@framework/utils/http";

interface MenuProps {
  data: any;
  className?: string;
}

const HeaderMenu: React.FC<MenuProps> = ({ className }) => {
  const { t } = useTranslation("menu");

  const [nevdata, setParentNavData] = React.useState([]);
  React.useEffect(() => {
    http.get(API_ENDPOINTS.MENU).then((response) => {
      setParentNavData(response.data.menu);
    });
  }, []);

  console.log("navbar data: ", nevdata);
  console.log("Navbar Data");

  return (
    <nav className={classNames(`headerMenu flex w-full relative`, className)}>
      {nevdata?.map((item: any) => {
        if (!item?.subMenu?.length) return;
        return (
          <div
            className={`menuItem group cursor-pointer py-7 ${
              item.subMenu ? "relative" : ""
            }`}
            key={item.category_id}
          >
            <Link
              href={`/products?product_slug=${item.category_slug}`}
              className="inline-flex items-center text-sm xl:text-base text-heading px-3 xl:px-4 py-2 font-normal relative "
            >
              {t(item.category_name)}
              {(item?.inner || item.subMenu) && (
                <span className="opacity-30 text-xs mt-1 xl:mt-0.5 w-4 flex justify-end">
                  <FaChevronDown className="transition duration-300 ease-in-out transform group-hover:-rotate-180" />
                </span>
              )}
            </Link>

            {/* {item?.subMenu && Array.isArray(item.subMenu) && (
            <MegaMenu subMenu={item.subMenu} />
          )} */}

            {item?.subMenu && Array.isArray(item.subMenu) && (
              <div className="subMenu shadow-header bg-gray-650 absolute start-0 opacity-0 group-hover:opacity-100">
                <ul className="text-white text-sm py-5">
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
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default HeaderMenu;
