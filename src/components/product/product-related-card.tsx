//@ts-nocheck

import cn from "classnames";
import Image from "next/image";
import { FC } from "react";
import { useUI } from "@contexts/ui.context";
import usePrice from "@framework/product/use-price";
import { Product } from "@framework/types";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useContext } from "react";
import { userContext } from "@contexts/user.context";
import { colorsContext } from "@contexts/colors.context";

interface ProductProps {
  product: Product;
  className?: string;
  contactClassName?: string;
  imageContentClassName?: string;
  variant?: "grid" | "gridSlim" | "list" | "listSmall";
  imgWidth?: number | string;
  imgHeight?: number | string;
  imgLoading?: "eager" | "lazy";
}

const ProductRelatedCard: FC<ProductProps> = ({
  product,
  className = "",
  contactClassName = "",
  imageContentClassName = "",
  variant = "list",
  imgWidth = 340,
  imgHeight = 440,
  imgLoading,
}) => {
  const { openModal, setModalView, setModalData } = useUI();
  const { name: username } = useContext(userContext);
  const { theme } = useContext(colorsContext);
  // const placeholderImage = `/assets/placeholder/products/product-${variant}.svg`;
  const placeholderImage = `/assets/placeholder/products/product-${variant}.svg`;
  const { selling_price, purchase_price, discount_price } = usePrice({
    // amount: product.sale_price ? product.sale_price : product.selling_price,
    amount: product.selling_price,

    baseAmount: product.purchase_price,
    currencyCode: "USD",
  });
  function handlePopupView() {
    setModalData({ data: product });
    setModalView("PRODUCT_VIEW");
    return openModal();
  }

  function handlePopupLogin() {
    setModalView("LOGIN_VIEW");
    return openModal();
  }
  // (product, 'prooo');
  const myLoader = ({ src }) => {

    if (
      src?.toString()?.includes("shopify") ||
      src?.toString()?.includes("repziocdn") ||
      src?.toString()?.includes("elementvape")
    ) {
      return data?.details?.product_thumbnail;
    }

    return `${API_ENDPOINTS.NEXT_PUBLIC_REST_ENDPOINT}/public/assets/img/products/thumb/${src}`;
  };
  return (
    <div
      style={{
        backgroudColor: theme.cardBg,
        color: theme.textColor,
      }}
      className={cn(
        "group box-border overflow-hidden flex rounded-md cursor-pointer",
        {
          "pe-0 pb-2 lg:pb-3 flex-col items-start  transition duration-200 ease-in-out transform hover:-translate-y-1 hover:md:-translate-y-1.5 hover:shadow-product":
            variant === "grid",
          "pe-0 md:pb-1 flex-col items-start ": variant === "gridSlim",
          "items-center bg-transparent border border-gray-100 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-listProduct":
            variant === "listSmall",
          "flex-row items-center transition-transform ease-linear bg-gray-200 pe-2 lg:pe-3 2xl:pe-4":
            variant === "list",
        },
        className
      )}
      role="button"
      title={product?.product_name}
    >
      <div
        className={cn(
          "flex",
          {
            "mb-3 md:mb-3.5": variant === "grid",
            "mb-3 md:mb-3.5 pb-0": variant === "gridSlim",
            "flex-shrink-0 w-32 sm:w-44 md:w-36 lg:w-44":
              variant === "listSmall",
          },
          imageContentClassName
        )}
        onClick={handlePopupView}
      >
        <Image
          loader={myLoader}
          // src={product?.image?.thumbnail ?? placeholderImage}
          // src={product?.image?.product_thumbnail ?? placeholderImage}
          src={product?.product_thumbnail ?? placeholderImage}
          width={imgWidth}
          height={imgHeight}
          loading={imgLoading}
          quality={100}
          style={{
            backgroudColor: theme.cardBg,
            color: theme.textColor,
          }}
          alt={product?.product_name || "Product Image"}
          className={cn("object-cover rounded-s-md", {
            "w-full rounded-md transition duration-200 ease-in group-hover:rounded-b-none":
              variant === "grid",
            "rounded-md transition duration-150 ease-linear transform group-hover:scale-105":
              variant === "gridSlim",
            "rounded-s-md transition duration-200 ease-linear transform group-hover:scale-105":
              variant === "list",
          })}
        />
      </div>
      <div
        className={cn(
          "w-full overflow-hidden",
          {
            "md:px-2.5 xl:px-4": variant === "grid",
            "ps-0": variant === "gridSlim",
            "px-4 lg:px-5 2xl:px-4": variant === "listSmall",
          },
          contactClassName
        )}
      >
        <h2
          className={cn("text- font-semibold truncate mb-1", {
            "text-sm md:text-base": variant === "grid",
            "md:mb-1.5 text-sm sm:text-base md:text-sm lg:text-base xl:text-lg":
              variant === "gridSlim",
            "text-sm sm:text-base md:mb-1.5 pb-0": variant === "listSmall",
            "text-sm sm:text-base md:text-sm lg:text-base xl:text-lg md:mb-1.5":
              variant === "list",
          })}
          onClick={handlePopupView}
        >
          {product?.product_name}
        </h2>
        {product?.short_description && (
          <p
            onClick={handlePopupView}
            dangerouslySetInnerHTML={{ __html: product?.short_description }}
            className="text-gray-500 text-xs lg:text-sm leading-normal xl:leading-relaxed max-w-[250px] truncate"
          ></p>
        )}
        {username ? (
          <div
            onClick={handlePopupView}
            className={`text-pink-500 font-semibold text-sm sm:text-base mt-1.5 space-s-2 ${
              variant === "grid"
                ? "lg:text-lg lg:mt-2.5"
                : "sm:text-xl md:text-base lg:text-xl md:mt-2.5 2xl:mt-3"
            }`}
          >
            <span className="inline-block">${product?.discount_price}.00</span>
            {product?.selling_price && (
              <del className="sm:text-base font-normal text-gray-600">
                ${product?.selling_price}.00
              </del>
            )}
          </div>
        ) : (
          <div
            onClick={handlePopupLogin}
            className={`text-pink-500 text-sm font-semibold cursor-pointer mt-1.5 space-s-2 ${
              variant === "grid" ? " lg:mt-2.5" : "- md:mt-2.5 2xl:mt-3"
            }`}
          >
            <span>View Price</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRelatedCard;
