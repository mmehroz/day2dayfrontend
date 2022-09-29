import React from 'react';
import Link from '@components/ui/link';
import { useTranslation } from 'next-i18next';

interface MenuItem {
  subsubcategory_slug: any;
  id: number | string;
  path: string;
  label: string;
}
type MegaMenuProps = {
  subMenu: {
    category_id: Key | null | undefined;
    subsubcategory_name(subsubcategory_name: any): React.ReactNode;
    subcategory_slug: any;
    sub: MenuItem[];
    id: number | string;
    inner: MenuItem[];
  }[];
};

const MegaMenu: React.FC<MegaMenuProps> = ({ subMenu }) => {
  const { t } = useTranslation('menu');
  return (
    <div className="megaMenu shadow-header bg-gray-650 absolute -start-20 xl:start-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
      <div className="grid grid-cols-5">
        {/* {subMenu?.map((column) => (
          <ul
            className="even:bg-gray-700 pb-7 2xl:pb-8 pt-6 2xl:pt-7"
            key={column.id}
          > */}
        {subMenu?.map((column) => (
          <React.Fragment key={column.category_id}>
            <li className="mb-1.5">
              <Link
                href={`/products?product_slug=${column.subcategory_slug}`}
                className="block text-sm py-1.5 text-heading font-semibold px-5 xl:px-8 2xl:px-10 hover:text-heading hover:bg-gray-600"
              >
                {t(column.subcategory_name)}
              </Link>
            </li>
            {column?.inner?.map((item: any) => (
              <li
                key={item.subcategory_id}
                className={
                  column?.inner.length === item.subcategory_id
                    ? 'border-b border-gray-300 pb-3.5 mb-3'
                    : ''
                }
              >
                <Link
                  href={`/products?product_slug=${column.subsubcategory_slug}`}
                  className="text-body text-sm block py-1.5 px-5 xl:px-8 2xl:px-10 hover:text-heading hover:bg-gray-600"
                >
                  {t(item.subsubcategory_name)}
                </Link>
              </li>
            ))}
          </React.Fragment>
        ))}
        {/* </ul>
        ))} */}
      </div>
    </div>
  );
};

export default MegaMenu;
