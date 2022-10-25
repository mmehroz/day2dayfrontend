import { useTranslation } from "next-i18next";
import { IoIosArrowForward } from "react-icons/io";
import Link from "./link";

const ListMenu = ({ dept, data, hasSubMenu, menuIndex }: any) => {
  const { t } = useTranslation("menu");

  console.log("header data 8 ", data);

  return (
    <li className="">
      <Link
        href={`/product/${data?.id ? "product_sub" : "product_inner"}=${
          data?.id ? data?.id : data?.subcategory_id
        }`}
        className="flex items-center justify-between py-2 ps-5 xl:ps-7 pe-3 xl:pe-3.5 hover:text-heading  hover:bg-gradient-to-tr to-orange-500 from-orange-800"
      >
        {t(data.subcategory_name)} {data?.subcategory_id}
        {data.inner?.length ? (
          <span className="text-sm mt-0.5 shrink-0">
            <IoIosArrowForward className="text-white transition duration-300 ease-in-out group-hover:text-white" />
          </span>
        ) : null}
      </Link>
      {data?.inner?.length ? (
        <SubMenu dept={dept} data={data.inner} menuIndex={menuIndex} />
      ) : null}
    </li>
  );
};

const SubMenu: React.FC<any> = ({ dept, data, menuIndex }) => {
  dept = dept + 1;
  console.log(data);
  console.log(dept);
  console.log(menuIndex);
  console.log("submenu");
  return (
    <ul className="subMenuChild  shadow-subMenu bg-gray-690  absolute z-[99999] end-full 2xl:end-auto 2xl:start-full opacity-0 invisible left-64 bottom-0 mt-3 top-0 right-0 w-56 py-3 overflow-y-scroll">
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
