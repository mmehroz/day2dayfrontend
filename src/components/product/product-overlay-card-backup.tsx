//@ts-nocheck

import Image from "next/image";
import { useUI } from "@contexts/ui.context";
import usePrice from "@framework/product/use-price";
import { Product } from "@framework/types";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useContext } from "react";
import http from "@framework/utils/http";
import Cookies from "js-cookie";
import { userContext } from "@contexts/user.context";
import { colorsContext } from "@contexts/colors.context";

interface ProductProps {
  product: Product;
  index: number;
  imgLoading?: "eager" | "lazy";
  variant?: "left" | "center" | "combined" | "flat";
}

const ProductOverlayCardBackup: React.FC<ProductProps> = ({
  product,
  index,
  variant = "left",
  imgLoading = "lazy",
}) => {
  let size = 300;
  let classes;

  if (variant === "left" && index === 0) {
    classes = "row-span-full lg:row-span-2 col-span-full lg:col-span-2";
    size = 620;
  } else if (variant === "center" && index === 1) {
    classes = "row-span-full lg:row-span-2 col-span-full lg:col-span-2";
    size = 620;
  } else if (variant === "combined") {
    if (index === 0) {
      classes = "col-span-2 lg:row-span-2 col-span-full lg:col-span-2";
      size = 620;
    } else if (index === 2) {
      classes = `col-span-2 lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-3`;
      size = 620;
    } else {
      classes = "col-span-2 lg:col-span-1";
    }
  } else {
    classes = "col-span-2 lg:col-span-1";
  }

  const { openModal, setModalView, setModalData } = useUI();
  const { selling_price, purchase_price, discount_price } = usePrice({
    amount: product.sale_price ? product.sale_price : product.price,
    baseAmount: product.price,
    currencyCode: "USD",
  });

  const { name } = useContext(userContext);
  const { theme } = useContext(colorsContext);

  function handlePopupView() {
    setModalData({ data: product });
    setModalView("PRODUCT_VIEW");
    return openModal();
  }

  const placeholderImage = `/assets/placeholder/products/product-${variant}.svg`;

  const renderSellingPrice = () => {
    if (name) {
      return (
        <del className="text-sm md:text-base lg:text-sm xl:text-base 3xl:text-lg">
          ${product.selling_price}.00
        </del>
      );
    }
  };

  const renderPuchasePrice = () => {
    if (name) {
      return (
        <div className=" text-white font-segoe font-semibold text-base md:text-xl lg:text-base xl:text-xl 3xl:text-2xl 3xl:mt-0.5 pe-2 md:pe-0 lg:pe-2 2xl:pe-0">
          ${product.discount_price}.00
        </div>
      );
    }
  };

  const renderDiscountPrice = () => {
    if (name) {
      return (
        <span className="absolute top-3.5 md:top-5 3xl:top-7 start-3.5 md:start-5 3xl:start-7 text-white bg-gradient-to-r from-orange-500 to-pink-500 text-10px md:text-sm leading-5 rounded-xl inline-block px-2 xl:px-3 pt-0.5 pb-1">
          {product.discount_price}
        </span>
      );
    }
  };

  const myLoader = ({ src }) => {
    return `${API_ENDPOINTS.NEXT_PUBLIC_REST_ENDPOINT}/public/assets/img/products/thumb/${src}`;
  };
  return (
    <div
      style={{
        backgroundColor: theme?.backgroundColorSecondary,
      }}
      onClick={handlePopupView}
      className={`${classes} cursor-pointer group flex flex-col  rounded-md relative items-center justify-between overflow-hidden`}
    >
      <div
        className="flex justify-center items-end w-full h-full 3xl:min-h-[330px]"
        title={product?.name}
      >
        <Image
          loader={myLoader}
          src={product?.product_thumbnail || placeholderImage}
          width={size}
          height={size}
          loading={imgLoading}
          alt={product?.product_name || "Product Image"}
          className="transition duration-500 object-contain ease-in-out transform group-hover:scale-110 rounded-md"
        />
        <div
          style={{
            color: theme?.textColor,
          }}
          className="absolute flex flex-col md:flex-row  2xl:flex-row md:justify-between md:items-center lg:items-start 2xl:items-center w-full px-4 md:px-5 3xl:px-7 pb-4 md:pb-5 3xl:pb-7"
          title={product?.product_name}
        >
          <div
            style={{
              color: theme?.textColor,
            }}
            className="md:pe-2 lg:pe-0 2xl:pe-2 overflow-hidden"
          >
            <h2
              style={{
                color: theme?.textColor,
              }}
              className="font-semibold text-sm md:text-base xl:text-lg mb-1 truncate"
            >
              {product?.product_name}
            </h2>

            <p
              style={{
                color: theme?.textColor,
              }}
              className=" text-xs xl:text-sm leading-normal xl:leading-relaxed truncate max-w-[250px]"
            >
              {product?.short_description}
            </p>
          </div>
          <div className="flex-shrink-0 text-white flex md:flex-col  2xl:flex-col items-center md:items-end lg:items-start 2xl:items-end justify-end md:text-end lg:text-start xl:text-end mt-2 md:-mt-0.5 lg:mt-2 2xl:-mt-0.5">
            {renderSellingPrice()}
            {renderPuchasePrice()}
          </div>
        </div>
      </div>
      {renderDiscountPrice()}
    </div>
  );
};

export default ProductOverlayCardBackup;
