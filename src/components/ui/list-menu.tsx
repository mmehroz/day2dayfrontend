import { useTranslation } from "next-i18next";
import { IoIosArrowForward } from "react-icons/io";
import Link from "./link";
import { useContext } from "react";
import { colorsContext } from "@contexts/colors.context";

const ListMenu = ({ dept, data, hasSubMenu, menuIndex, parent, sub }: any) => {
  const { t } = useTranslation("menu");
  const { theme } = useContext(colorsContext);

  const renderLink = () => {
    let link = "/product/";
    if (parent) link = link + parent;
    if (sub) link = `${link}/${sub}`;
    link = `${link}/${data?.subcategory_slug}`;

    return link;
  };

  return (
    <li
      style={{
        color: theme.textColor,
        backgroundColor: theme.backgroundColorSecondary,
      }}
      className=""
    >
      <Link
        href={renderLink()}
        className="flex items-center justify-between py-2 ps-5 xl:ps-7 pe-3 xl:pe-3.5 hover:text-heading  hover:bg-gradient-to-tr to-orange-500 from-orange-800"
      >
        {t(data.subcategory_name)} 
        {data.inner?.length ? (
          <span className="text-sm mt-0.5 shrink-0">
            <IoIosArrowForward
              style={{
                color: theme.textColor,
              }}
              className=" transition duration-300 ease-in-out group-hover:text-white"
            />
          </span>
        ) : null}
      </Link>
      {data?.inner?.length ? (
        <SubMenu
          parent={parent}
          dept={dept}
          data={data.inner}
          menuIndex={menuIndex}
          sub={data?.subcategory_slug}
        />
      ) : null}
    </li>
  );
};

const SubMenu: React.FC<any> = ({ dept, data, menuIndex, parent, sub }) => {
  const { theme } = useContext(colorsContext);
  dept = dept + 1;


  return (
    <ul
      style={{
        color: theme.textColor,
        backgroundColor: theme.backgroundColorSecondary,
      }}
      className="subMenuChild  shadow-subMenu   absolute z-[99999] end-full 2xl:end-auto 2xl:start-full opacity-0 invisible left-64 bottom-0 mt-3 top-0 right-0 w-56 py-3 overflow-y-scroll"
    >
      {data?.map((menu: any, index: number) => {
        const menuName: string = `sidebar-submenu-${dept}-${menuIndex}-${index}`;

        return (
          <ListMenu
            dept={dept}
            data={menu}
            hasSubMenu={menu.subMenu}
            menuName={menuName}
            key={menuName}
            menuIndex={index}
            parent={parent}
            sub={sub}
          />
        );
      })}
    </ul>
  );
};

export default ListMenu;
