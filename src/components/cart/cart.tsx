import Scrollbar from "@components/common/scrollbar";
import { useCart } from "@contexts/cart/cart.context";
import { motion } from "framer-motion";
import { fadeInOut } from "@utils/motion/fade-in-out";
import { useUI } from "@contexts/ui.context";
import usePrice from "@framework/product/use-price";
import { IoClose } from "react-icons/io5";
import CartItem from "./cart-item";
import EmptyCart from "./empty-cart";
import Link from "@components/ui/link";
import { ROUTES } from "@utils/routes";
import cn from "classnames";
import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { userContext } from "@contexts/user.context";
import { colorsContext } from "@contexts/colors.context";

export default function Cart() {
  const { name: username } = useContext(userContext);
  const { theme } = useContext(colorsContext);
  const { t } = useTranslation("common");
  const { items, total, isEmpty } = useCart();
  const { price: cartTotal } = usePrice({
    amount: total,
    currencyCode: "USD",
  });

  const { openModal, setModalView, closeCart } = useUI();

  const handleLoginFormView = () => {
    setModalView("LOGIN_VIEW");
    return openModal();
  };

  return (
    <div
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
      className="flex flex-col w-full h-full justify-between "
    >
      <div className=" w-full flex justify-between items-center relative ps-5 md:ps-7 py-0.5 border-b border-gray-600">
        <h2 className="font-bold text-xl md:text-2xl m-0 ">
          {t("text-shopping-cart")}
        </h2>
        <button
          className="flex text-2xl items-center justify-center  px-4 md:px-6 py-6 lg:py-8 focus:outline-none transition-opacity hover:opacity-60"
          onClick={closeCart}
          aria-label="close"
        >
          <IoClose className="- mt-1 md:mt-0.5" />
        </button>
      </div>
      {!isEmpty ? (
        <Scrollbar className="cart-scrollbar w-full flex-grow">
          <div className="w-full px-5 md:px-7 ">
            {items?.map((item) => (
              <CartItem item={item} key={item.id} />
            ))}
          </div>
        </Scrollbar>
      ) : (
        <motion.div
          layout
          initial="from"
          animate="to"
          exit="from"
          variants={fadeInOut(0.25)}
          className="px-5 md:px-7 pt-8 pb-5 flex justify-center flex-col items-center"
        >
          <EmptyCart />
          <h3 className="text-lg - font-bold pt-8">{t("text-empty-cart")}</h3>
        </motion.div>
      )}

      <div
        className="flex flex-col px-5 md:px-7 pt-2 pb-5 md:pb-7"
        onClick={closeCart}
      >
        {username ? (
          <Link
            style={{
              backgroundColor: theme.backgroundColorThird,
              color: theme.textColor,
            }}
            href={isEmpty === false ? ROUTES.CHECKOUT : "/"}
            className={cn(
              "w-full px-5 py-3 md:py-4 flex items-center justify-center bg-gray-650 rounded-md text-sm sm:text-base text-white focus:outline-none transition duration-300 hover:bg-gradient-to-tr hover:to-orange-500 hover:from-orange-800 ",
              {
                "cursor-not-allowed bg-gray-400 hover:bg-gradient-to-tr hover:to-orange-500 hover:from-orange-800 ":
                  isEmpty,
              }
            )}
          >
            <span className="w-full pe-5 -mt-0.5 py-0.5 ">
              {t("text-proceed-to-checkout")}
            </span>
            <span className="ms-auto flex-shrink-0 -mt-0.5 py-0.5  ">
              <span className="border-s pe-5 py-0.5 " />
              {cartTotal}
            </span>
          </Link>
        ) : (
          <div
            style={{
              backgroundColor: theme.backgroundColorThird,
              color: theme.textColor,
            }}
            onClick={handleLoginFormView}
            className={cn(
              "w-full  px-5 cursor-pointer py-3 md:py-4 flex items-center justify-center  rounded-md text-sm sm:text-base  focus:outline-none transition duration-300 hover:bg-gradient-to-tr hover:to-orange-500 hover:from-orange-800 ",
              {
                "cursor-not-allowed  hover:bg-gradient-to-tr hover:to-orange-500 hover:from-orange-800 ":
                  isEmpty,
              }
            )}
          >
            <span className="w-full pe-5 -mt-0.5 py-0.5 ">
              {t("text-proceed-to-checkout")}
            </span>
            <span className="ms-auto flex-shrink-0 -mt-0.5 py-0.5  ">
              <span className="border-s pe-5 py-0.5 " />
              {"Login"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
