//@ts-nocheck

import { Item } from "@contexts/cart/cart.utils";
import { generateCartItemName } from "@utils/generate-cart-item-name";
import usePrice from "@framework/product/use-price";
import { useContext } from "react";
import { colorsContext } from "@contexts/colors.context";

export const CheckoutItem: React.FC<{ item: Item }> = ({ item }) => {
  const { theme } = useContext(colorsContext);
  const { price } = usePrice({
    amount: item.itemTotal,
    currencyCode: "USD",
  });

  const renderImage = () => {
    if (
      item?.image?.toString()?.includes("shopify") ||
      item?.image?.toString()?.includes("repziocdn") ||
      item?.image?.toString()?.includes("elementvape")
    ) {
      return item?.image;
    }

    return (
      `https://portal.day2daywholesale.com/public/assets/img/products/thumb/${item?.image}` ??
      placeholderImage
    );
  };

  return (
    <div
      style={{
        color: theme.textColor,
        borderColor: theme.borderColor,
      }}
      className="flex py-4 items-center lg:px-3 border-b border-gray-300"
    >
      <div
        style={{
          backgroundColor: theme.backgroundColorThird,
        }}
        className="flex  rounded-md  w-16 h-16 flex-shrink-0"
      >
        <img
          src={renderImage()}
          width="64"
          height="64"
          className="object-cover"
        />
      </div>
      <h6 className="text-sm ps-3 font-regular">
        {generateCartItemName(item.product_name, item.attributes)}
      </h6>
      <div className="flex ms-auto text-sm ps-2 flex-shrink-0">{price}</div>
    </div>
  );
};
