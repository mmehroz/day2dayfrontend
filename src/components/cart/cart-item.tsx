//@ts-nocheck

import Link from "@components/ui/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInOut } from "@utils/motion/fade-in-out";
import { IoIosCloseCircle } from "react-icons/io";
import Counter from "@components/common/counter";
import { useCart } from "@contexts/cart/cart.context";
import usePrice from "@framework/product/use-price";
import { ROUTES } from "@utils/routes";
import { generateCartItemName } from "@utils/generate-cart-item-name";
import { useTranslation } from "next-i18next";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useContext } from "react";
import { userContext } from "@contexts/user.context";
import { colorsContext } from "@contexts/colors.context";

type CartItemProps = {
  item: any;
};

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { t } = useTranslation("common");
  const { theme } = useContext(colorsContext);
  const { name: username } = useContext(userContext);
  const { addItemToCart, removeItemFromCart, clearItemFromCart } = useCart();
  const { price } = usePrice({
    amount: item.selling_price,
    currencyCode: "USD",
  });
  const { price: totalPrice } = usePrice({
    amount: item.itemTotal,
    currencyCode: "USD",
  });

  const myLoader = ({ src }) => {
    if (
      src?.toString()?.includes("shopify") ||
      src?.toString()?.includes("repziocdn")
    ) {
      return src;
    }
    return `${API_ENDPOINTS.NEXT_PUBLIC_REST_ENDPOINT}/public/assets/img/products/thumb/${src}`;
  };
  // const placeholderImage = `/assets/placeholder/products/product-${variant}.svg`;
  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      style={{
        color: theme.textColor,
      }}
      className={`group w-full h-auto flex justify-start items-center py-4 md:py-7 border-b border-gray-600 relative last:border-b-0`}
      title={item?.product_name}
    >
      <div className="relative flex w-24 md:w-28 h-24 md:h-28 rounded-md overflow-hidden bg-gray-200 flex-shrink-0 cursor-pointer me-4">
        <Image
          // src={
          //   // `${API_ENDPOINTS.PRODUCT_THUMBNAIL}/${item?.image}` ??
          //   '/assets/placeholder/cart-item.svg'
          // }
          src={item?.image ?? "/assets/placeholder/cart-item.svg"}
          loader={myLoader}
          width={112}
          height={112}
          loading="eager"
          alt={item.name || "Product Image"}
          className="bg-gray-300 object-cover"
        />
        <div
          className="absolute top-0 start-0 h-full w-full bg-black bg-opacity-30 md:bg-opacity-0 flex justify-center items-center transition duration-200 ease-in-out md:group-hover:bg-opacity-30"
          onClick={() => clearItemFromCart(item.id)}
          role="button"
        >
          <IoIosCloseCircle className="relative  text-2xl transform md:scale-0 md:opacity-0 transition duration-300 ease-in-out md:group-hover:scale-100 md:group-hover:opacity-100" />
        </div>
      </div>

      <div className="flex flex-col w-full overflow-hidden">
        <Link
          href={`${ROUTES.PRODUCT}/${item?.slug}`}
          className="truncate text-sm  mb-1.5 -mt-1"
        >
          {generateCartItemName(item?.product_name, item.attributes)}
        </Link>
        {username ? (
          <span className="text-sm text-gray-400 mb-2.5">
            {t("text-unit-price")} : &nbsp; ${item?.price}.00
          </span>
        ) : null}

        <div className="flex items-end justify-between">
          <Counter
            quantity={item.quantity}
            onIncrement={() => addItemToCart(item, 1)}
            onDecrement={() => removeItemFromCart(item.id)}
            variant="dark"
          />
          {username ? (
            <span className="font-semibold text-sm md:text-base leading-5">
              {totalPrice}
            </span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
