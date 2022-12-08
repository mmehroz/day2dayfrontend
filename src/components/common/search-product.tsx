//@ts-nocheck
import Link from "@components/ui/link";
import Image from "next/image";
import usePrice from "@framework/product/use-price";
import { ROUTES } from "@utils/routes";

type SearchProductProps = {
  item: any;
};

const SearchProduct: React.FC<SearchProductProps> = ({ item }) => {
  const { price, basePrice } = usePrice({
    amount: item.sale_price ? item.sale_price : item.price,
    baseAmount: item.price,
    currencyCode: "USD",
  });

  const renderImage = () => {
    if (
      item?.product_thumbnail?.toString()?.includes("https") ||
      item?.product_thumbnail?.toString()?.includes("repziocdn") ||
      item?.product_thumbnail?.toString()?.includes("elementvape")
    ) {
      return item?.product_thumbnail;
    }

    return (
      `https://portal.day2daywholesale.com/public/assets/img/products/thumb/${item?.product_thumbnail}` ??
      placeholderImage
    );
  };


  return (
    <Link
      href={`${ROUTES.PRODUCT}/${item?.product_slug}`}
      className="group w-full h-auto flex justify-start items-center"
    >
      <div className="relative flex w-24 h-24 rounded-md overflow-hidden bg-gray-200 flex-shrink-0 cursor-pointer me-4">
        <Image
          src={
            `https://portal.day2daywholesale.com/public/assets/img/products/thumb/${item?.product_thumbnail}` ??
            "/assets/placeholder/search-product.svg"
          }
          width={96}
          height={96}
          loading="eager"
          alt={item.name || "Product Image"}
          loader={renderImage}
          className="bg-gray-200 object-cover"
        />
      </div>
      <div className="flex flex-col w-full overflow-hidden justify-center">
        <h3 className="truncate text-sm text-gray-600 mb-2 font-semibold">
          {item?.product_name}
        </h3>
        <h3 className="truncate text-sm text-gray-600 mb-2 font-semibold">
          ${item?.discount_price}.00
        </h3>
        <div className="text-heading font-semibold text-sm">
          {price}
          <del className=" text-gray-400 font-normal">
            ${item?.selling_price}.00
          </del>
        </div>
      </div>
    </Link>
  );
};

export default SearchProduct;
