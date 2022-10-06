import { useTranslation } from "next-i18next";
import { IoIosArrowForward } from "react-icons/io";
import Link from "./link";

const ListMenu = ({ dept, data, hasSubMenu, menuIndex }: any) => {
  console.log(data, "data");
  const { t } = useTranslation("menu");
  console.log(data.inner);
  console.log("data inner");
  return (
    <li className="relative">
      <Link
        href={`/products?product_slug=${data.subcategory_slug}`}
        className="flex items-center justify-between py-2 ps-5 xl:ps-7 pe-3 xl:pe-3.5 hover:text-heading hover:bg-gray-600"
      >
        {t(data.subcategory_name)}
        {data.inner && (
          <span className="text-sm mt-0.5 shrink-0">
            <IoIosArrowForward className="text-white transition duration-300 ease-in-out group-hover:text-black" />
          </span>
        )}
      </Link>
      {data?.inner?.length ? (
        <SubMenu dept={dept} data={data.inner} menuIndex={menuIndex} />
      ) : null}
    </li>
  );
};

const SubMenu: React.FC<any> = ({ dept, data, menuIndex }) => {
  dept = dept + 1;
  return (
    <ul className="subMenuChild shadow-subMenu bg-gray-690 absolute z-0 end-full 2xl:end-auto 2xl:start-full opacity-0 invisible top-4 w-56 py-3">
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
          />
        );
      })}
    </ul>
  );
};

export default ListMenu;
