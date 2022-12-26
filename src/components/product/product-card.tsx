//@ts-nocheck

import cn from "classnames";
import Image from "next/image";
import { FC } from "react";
import { useUI } from "@contexts/ui.context";
import usePrice from "@framework/product/use-price";
import { Product } from "@framework/types";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useContext } from "react";
import Cookies from "js-cookie";
import http from "@framework/utils/http";
import { userContext } from "@contexts/user.context";
import { useState } from "react";
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

const ProductCard: FC<ProductProps> = ({
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
  const { name } = useContext(userContext);
  const { theme } = useContext(colorsContext);
  const [block, setBlock] = useState<boolean>(false);

  // const placeholderImage = `/assets/placeholder/products/product-${variant}.svg`;
  const placeholderImage = `/assets/placeholder/products/product-${variant}.svg`;

  function handlePopupView() {
    setModalData({ data: product });
    setModalView("PRODUCT_VIEW");
    return openModal();
  }
  const myLoader = ({ src }) => {
    if (
      src?.toString()?.includes("shopify") ||
      src?.toString()?.includes("repziocdn") ||
      src?.toString()?.includes("elementvape") ||
      src?.toString()?.includes("junipercdn")
    ) {
      return src;
    }
    return `${API_ENDPOINTS.NEXT_PUBLIC_REST_ENDPOINT}/public/assets/img/products/thumb/${src}`;
  };

  const rendeSellingPrice = () => {
    if (name) {
      return (
        <div
          className={`text-pink-500 px-2 pb-2 font-semibold text-sm sm:text-base mt-1.5 space-s-2 ${
            variant === "grid"
              ? "lg:text-lg lg:mt-2.5"
              : "sm:text-xl md:text-base lg:text-xl md:mt-2.5 2xl:mt-3"
          }`}
        >
          <span className="inline-block">${product.discount_price}.00</span>
          {product.selling_price && (
            <del className="sm:text-base font-normal ">
              ${product.selling_price}.00
            </del>
          )}
        </div>
      );
    }

    return (
      <div
        className={`text-pink-500 px-2 font-semibold text-sm sm:text-base mt-1.5 space-s-2 ${
          variant === "grid"
            ? "lg:text-lg lg:mt-2.5"
            : "sm:text-xl md:text-base lg:text-xl md:mt-2.5 2xl:mt-3"
        }`}
      >
        <span
          onClick={() => {
            setBlock(!block);

            setModalView("LOGIN_VIEW");

            return openModal();
          }}
          className="inline-block text-xs cursor-pointer px-2"
        >
          view price
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        color: theme.textColor,
      }}
      className={cn(
        "group box-border overflow-hidden flex rounded-md cursor-pointer",
        {
          "pe-0 pb-2 lg:pb-3 flex-col items-start  transition duration-200 ease-in-out transform hover:-translate-y-1 hover:md:-translate-y-1.5 hover:shadow-product":
            variant === "grid",
          "pe-0 md:pb-1 flex-col items-start ": variant === "gridSlim",
          "items-center bg-transparent border  transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-listProduct":
            variant === "listSmall",
          "flex-row items-center transition-transform ease-linear  pe-2 lg:pe-3 2xl:pe-4":
            variant === "list",
        },
        className
      )}
      role="button"
      title={product?.product_name}
    >
      <div
        className={cn(
          "flex ",
          {
            "mb-3 md:mb-3.5": variant === "grid",
            "mb-3 md:mb-3.5 pb-0": variant === "gridSlim",
            "flex-shrink-0 w-32 sm:w-44 md:w-36 lg:w-44":
              variant === "listSmall",
          },
          imageContentClassName
        )}
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
          onClick={handlePopupView}
          style={{
            backgroundColor: theme.cardBg,
            color: theme.textColor,
          }}
          alt={product?.product_name || "Product Image"}
          className={cn(" rounded-s-md object-contain ", {
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
          onClick={handlePopupView}
          className={cn(" font-semibold truncate mb-1 px-2", {
            "text-sm md:text-base": variant === "grid",
            "md:mb-1.5 text-sm sm:text-base md:text-sm lg:text-base xl:text-lg":
              variant === "gridSlim",
            "text-sm sm:text-base md:mb-1.5 pb-0": variant === "listSmall",
            "text-sm sm:text-base md:text-sm lg:text-base xl:text-lg md:mb-1.5":
              variant === "list",
          })}
        >
          {product?.product_name}
        </h2>
        {product?.short_description && (
          <p
            dangerouslySetInnerHTML={{ __html: product?.short_description }}
            className=" text-xs lg:text-sm leading-normal xl:leading-relaxed max-w-[250px] truncate px-2"
          ></p>
        )}
        {rendeSellingPrice()}
      </div>
    </div>
  );
};

export default ProductCard;
