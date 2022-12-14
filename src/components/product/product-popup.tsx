//@ts-nocheck

import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import { ROUTES } from "@utils/routes";
import { useUI } from "@contexts/ui.context";
import Button from "@components/ui/button";
import Counter from "@components/common/counter";
import { useCart } from "@contexts/cart/cart.context";
import { ProductAttributes } from "@components/product/product-attributes";
import { generateCartItem } from "@utils/generate-cart-item";
import usePrice from "@framework/product/use-price";
import { getVariations } from "@framework/utils/get-variations";
import { useTranslation } from "next-i18next";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { toast } from "react-toastify";
import { userContext } from "@contexts/user.context";
import { colorsContext } from "@contexts/colors.context";

export default function ProductPopup() {
  const { t } = useTranslation("common");
  const {
    modalData: { data },
    closeModal,
    openCart,
    openModal,
    setModalView,
  } = useUI();
  const { name: userName } = useContext(userContext);
  const router = useRouter();
  const { addItemToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [viewCartBtn, setViewCartBtn] = useState<boolean>(false);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [quantitySelected, setQuantitySelected] = useState(0);
  const { theme } = useContext(colorsContext);
  const [variantPrice, setVariantPrice] = useState(0);
  const [variantImage, setVariantImage] = useState("");

  const { selling_price, purchase_price, discount_price } = usePrice({
    amount: data.sale_price ? data.sale_price : data.selling_price,
    baseAmount: data.purchase_price,
    currencyCode: "USD",
  });

  const variantsLength = getVariantsLength();

  // const attributes = getAttributes(data.attributes);
  const variations = getVariations(data.variants);
  const {
    product_slug,
    product_thumbnail,
    product_name,
    long_description,
    short_description,
  } = data;

  function addToCart() {
    const dataVariantsKeys = data?.variants?.map((el: any) => {
      return el?.name;
    });

    if (Object.keys(attributes)?.length !== variantsLength) {
      return;
    }

    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 600);

    if (
      quantitySelected >= parseInt(data?.product_qty) ||
      quantity >= parseInt(data?.product_qty)
    ) {
      return;
    }

    const item = generateCartItem(
      {
        ...data,
        discount_price: variantPrice
          ? variantPrice
          : data?.details?.discount_price,
      },
      attributes
    );

    addItemToCart(item, quantity);
    toast("Added to the bag", {
      progressClassName: "fancy-progress-bar",
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setQuantitySelected((prev) => prev + 1);
  }

  function navigateToProductPage() {
    closeModal();
    router.push(`${ROUTES.PRODUCT}/${product_slug}`, undefined, {
      locale: router.locale,
    });
  }

  function handleAttribute(attribute: any) {
    const existed = Object.keys(attributes).filter((el, i) => attribute[el]);
    if (Object.keys(existed)?.length) {
      const attributesClone = attributes;
      delete attributesClone[existed];
      console.log(attributesClone);
      setAttributes((prev) => ({
        ...prev,
        ...attributesClone,
      }));

      return;
    }

    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
  }

  function navigateToCartPage() {
    closeModal();
    setTimeout(() => {
      openCart();
    }, 300);
  }

  function getVariantsLength() {
    let counter = 0;
    data?.variants?.map((el) => {
      if (el?.name) {
        counter++;
      }
    });

    return counter;
  }

  const renderImage = () => {
    if (variantImage) {
      return `https://portal.day2daywholesale.com/public/assets/img/variantsimages/${variantImage}`;
    }

    if (
      product_thumbnail?.toString()?.includes("shopify") ||
      product_thumbnail?.toString()?.includes("repziocdn") ||
      product_thumbnail?.toString()?.includes("elementvape")
    ) {
      return product_thumbnail;
    }

    return (
      `${API_ENDPOINTS.PRODUCT_THUMBNAIL}/${product_thumbnail}` ||
      "/assets/placeholder/products/product-thumbnail.svg"
    );
  };

  function onPriceClick() {
    setModalView("LOGIN_VIEW");
    return openModal();
  }

  function handleVariantData(data) {
    console.log("variation data: ", data);
    setVariantImage(data?.variantimage);
    setVariantPrice(data?.variantprice);
  }

  return (
    <div
      style={{
        backgroundColor: theme.backgroundColorSecondary,
        color: theme.textColor,
      }}
      className="rounded-lg "
    >
      <div
        style={{
          backgroundColor: theme.backgroundColorSecondary,
        }}
        className="flex flex-col lg:flex-row w-full md:w-[650px] lg:w-[960px] mx-auto overflow-hidden"
      >
        <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-430px max-h-500px  overflow-hidden ">
          <img
            src={renderImage()}
            alt={product_name}
            className="lg:object-contain lg:w-full lg:h-full object-cover"
          />
        </div>

        <div className="flex flex-col p-5 md:p-8 w-full">
          <div className="pb-5">
            <div
              className="mb-2 md:mb-2.5 block -mt-1.5"
              onClick={navigateToProductPage}
              role="button"
            >
              <h2 className="text- text-lg md:text-xl lg:text-2xl font-semibold hover:text--">
                {product_name}
              </h2>
            </div>
            <p
              dangerouslySetInnerHTML={{ __html: short_description }}
              className="text-sm leading-6 md:text- md:leading-7"
            />

            {userName ? (
              <div className="flex items-center mt-3">
                <div className="text- font-semibold text-base md:text-xl lg:text-2xl">
                  ${variantPrice ? variantPrice : data?.discount_price}.00
                </div>
                {data?.selling_price && (
                  <del className="font-segoe  text-base lg:text-xl ps-2.5 -mt-0.5 md:mt-0">
                    ${data?.selling_price}.00
                  </del>
                )}
              </div>
            ) : (
              <div className="flex items-center mt-4">
                <div
                  onClick={onPriceClick}
                  className="cursor-pointer font-semibold text-sm md:text-xl lg:text-xs text-red-500"
                >
                  View Price
                </div>
              </div>
            )}
          </div>

          {data?.variants?.map((variation: any) => {
            return (
              <>
                <div>
                  <ProductAttributes
                    key={`popup-attribute-key${variation.id}`}
                    title={variation?.name}
                    attributes={variation?.attributes}
                    // attributes={variation.attributes}
                    active={attributes[variation?.name]}
                    onClick={handleAttribute}
                    handleVariant={handleVariantData}
                    data={variation}
                  />
                </div>
              </>
            );
          })}

          <div className="pt-2 md:pt-4">
            <div className="flex items-center justify-between mb-4 space-s-3 sm:space-s-4">
              <Counter
                quantity={quantity}
                onIncrement={() => {
                  if (quantity >= parseInt(data?.product_qty)) return;

                  setQuantity((prev) => prev + 1);
                }}
                onDecrement={() =>
                  setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                }
                disableDecrement={quantity === 1}
              />

              <Button
                onClick={addToCart}
                variant="slim"
                style={{
                  backgroundColor: theme.backgroundColorThird,
                  color: theme.textColor,
                }}
                className={`w-full md:w-6/12 xl:w-full `}
                disabled={
                  Object.keys(attributes)?.length !== variantsLength ||
                  quantitySelected >= parseInt(data?.product_qty) ||
                  quantity >= parseInt(data?.product_qty)
                }
                loading={addToCartLoader}
              >
                <span className="py-2 3xl:px-8">Add to cart</span>
              </Button>
            </div>

            {viewCartBtn && (
              <button
                onClick={navigateToCartPage}
                className="w-full mb-4 h-11 md:h-12 rounded text-heading focus:outline-none border  transition-colors hover:bg-gray-50 focus:bg-gray-50"
              >
                {t("text-view-cart")}
              </button>
            )}

            <Button
              onClick={navigateToProductPage}
              variant="flat"
              className="w-full h-11 md:h-12 bg-gradient-to-r from-orange-500  to-pink-500 transition-colors hover:bg-gray-50 focus:bg-gray-50"
            >
              {t("text-view-details")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
