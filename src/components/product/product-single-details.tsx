import React, { useState } from "react";
import Button from "@components/ui/button";
import Counter from "@components/common/counter";
import { useRouter } from "next/router";
import { useProductQuery } from "@framework/product/get-product";
import { getVariations } from "@framework/utils/get-variations";
import usePrice from "@framework/product/use-price";
import { useCart } from "@contexts/cart/cart.context";
import { generateCartItem } from "@utils/generate-cart-item";
import { ProductAttributes } from "./product-attributes";
import Link from "@components/ui/link";
import { toast } from "react-toastify";
import { useWindowSize } from "@utils/use-window-size";
import { motion, AnimatePresence } from "framer-motion";
import ProductMetaReview from "./product-meta-review";

const productGalleryCarouselResponsive = {
  "768": {
    slidesPerView: 2,
  },
  "0": {
    slidesPerView: 1,
  },
};

const ProductSingleDetails: React.FC = () => {
  const {
    query: { slug },
  } = useRouter();

  const { width } = useWindowSize();
  const { data, isLoading } = useProductQuery(slug as string);
  const { addItemToCart } = useCart();
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);

  const [filters, setFilters] = useState({
    productDetails: false,
    additionalInformation: false,
    customerReviews: false,
  });

  const { price, basePrice, discount } = usePrice(
    data && {
      amount: data.sale_price ? data.sale_price : data.price,
      baseAmount: data.price,
      currencyCode: "USD",
    }
  );
  if (isLoading) return <p>Loading...</p>;
  const variations = getVariations(data?.sortvariants);

  const handleFilters = (value: string) => () => {
    setFilters({ ...filters, [value]: !filters[value] });
  };

  function addToCart() {
    if (Object.keys(attributes)?.length !== data?.sortvariants?.length) return;
    // to show btn feedback while product carting
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 600);

    const item = generateCartItem(data?.details, attributes);
    addItemToCart(item, quantity);
    toast("Added to the bag", {
      progressClassName: "fancy-progress-bar",
      position: width > 768 ? "bottom-right" : "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log(item, "item");
  }

  function handleAttribute(attribute: any) {
    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
  }

  function renderTags() {
    const tags = data?.details?.product_tags?.split(",");
    console.log("tags: ", tags);

    return tags?.map((el: string, _i: number) => (
      <Link
        href={`/${el}`}
        className="inline-block pe-1.5 transition hover:underline hover:text-heading last:pe-0"
      >
        {el}
      </Link>
    ));
  }

  const placeholderImage = `/assets/placeholder/products/product-gallery.svg`;

  console.log(data);
  console.log("data");

  return (
    <div className="block lg:grid grid-cols-9 gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20 items-start pl-52 px-40">
      {
        // width < 1025 ? (
        // 	<Carousel
        // 		pagination={{
        // 			clickable: true,
        // 		}}
        // 		breakpoints={productGalleryCarouselResponsive}
        // 		className="product-gallery"
        // 		buttonGroupClassName="hidden"
        // 	>
        // 		{data?.gallery?.map((item, index: number) => (
        // 			<SwiperSlide key={`product-gallery-key-${index}`}>
        // 				<div className="col-span-1 transition duration-150 ease-in hover:opacity-90">
        // 					<img
        // 						src={
        // 							item?.original ??
        // 							"/assets/placeholder/products/product-gallery.svg"
        // 						}
        // 						alt={`${data?.name}--${index}`}
        // 						className="object-cover w-full"
        // 					/>
        // 				</div>
        // 			</SwiperSlide>
        // 		))}
        // 	</Carousel>
        // ) :
        <div className="col-span-5 grid grid-cols-2 gap-2.5 ">
          {/* {data?.details?.map(( index: number) => ( */}
          <div
            // key={index}
            className="col-span-2 transition duration-150 ease-in hover:opacity-90"
          >
            <img
              src={
                `http://207.244.250.143/day2day/public/assets/img/products/thumb/${data?.details?.product_thumbnail}` ??
                placeholderImage
              }
              // src={
              // 	item?.original ??
              // 	"/assets/placeholder/products/product-gallery.svg"
              // }
              alt={`${data?.details?.product_name}`}
              className="object-cover w-full h-[80%]"
            />
          </div>
          {/* // ))} */}
        </div>
      }

      <div className="col-span-4 pt-8 lg:pt-0">
        <div className="pb-7 mb-7 border-b border-gray-300">
          <h2 className="text-heading text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold  mb-3.5">
            {data?.details?.product_name}
          </h2>
          <p
            dangerouslySetInnerHTML={{
              __html: data?.details?.short_description,
            }}
            className="text-body text-sm lg:text-base leading-6 lg:leading-8"
          ></p>
          <div className="flex items-center mt-5">
            <div className="text-heading font-bold text-base md:text-xl lg:text-2xl 2xl:text-4xl pe-2 md:pe-0 lg:pe-2 2xl:pe-0">
              ${data?.details?.purchase_price}.00
            </div>

            <span className="line-through font-segoe text-gray-400 text-sm md:text-base lg:text-lg xl:text-xl ps-2">
              ${data?.details?.selling_price}.00
            </span>
          </div>
        </div>

        {data?.sortvariants?.length && (
          <div className="pb-3 border-b border-gray-300">
            {data?.sortvariants?.map((variation: any) => {
              console.log("variations: ", variation);
              return (
                <ProductAttributes
                  key={`popup-attribute-key${variation.id}`}
                  title={variation?.name}
                  attributes={variation?.size}
                  // attributes={variation.attributes}
                  active={attributes[variation?.name]}
                  onClick={handleAttribute}
                />
              );
            })}
          </div>
        )}

        <div className="flex items-center space-s-4 md:pe-32 lg:pe-12 2xl:pe-32 3xl:pe-48 border-b border-gray-300 py-8">
          <Counter
            quantity={quantity}
            onIncrement={() => setQuantity((prev) => prev + 1)}
            onDecrement={() =>
              setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
            }
            disableDecrement={quantity === 1}
          />
          <Button
            onClick={addToCart}
            variant="slim"
            className="w-full md:w-6/12 xl:w-full bg-gradient-to-tr from-orange-800 to-orange-500  animate-shine"
            loading={addToCartLoader}
            disabled={
              Object.keys(attributes)?.length !== data?.sortvariants?.length
            }
          >
            <span className="py-2 3xl:px-8">Add to cart</span>
          </Button>
        </div>
        <div className="py-6">
          <ul className="text-sm space-y-5 pb-1">
            <li>
              <span className="font-semibold text-heading inline-block pe-2">
                SKU:
              </span>
              {data?.details?.product_sku}
            </li>
            <li>
              <span className="font-semibold text-heading inline-block pe-2">
                Category:
              </span>
              <Link
                href="/"
                className="transition hover:underline hover:text-heading"
              >
                {data?.details?.category_name}
              </Link>
            </li>
            <span className="font-semibold text-heading inline-block pe-2">
              Tags:
            </span>

            {renderTags()}

            {/* Not working right now  */}
            {/* {data?.tags && Array.isArray(data.tags) && (
              <li className="productTags">
                <span className="font-semibold text-heading inline-block pe-2">
                  Tags:
                </span>
                {data.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={tag.slug}
                    className="inline-block pe-1.5 transition hover:underline hover:text-heading last:pe-0"
                  >
                    {tag.name}
                    <span className="text-heading">,</span>
                  </Link>
                ))}
              </li>
            )} */}
          </ul>
          <div className="w-full h-2 border-t mt-6 mb-6" />

          <div className="flex flex-col">
            <div
              onClick={handleFilters("productDetails")}
              className="w-full flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold text-heading inline-block pe-2">
                Product Details
              </span>
              <span className={`font-semibold text-white text-[32px] `}>
                {filters?.productDetails ? "-" : "+"}
              </span>
            </div>
            <AnimatePresence>
              {filters?.productDetails && (
                <motion.span
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: 250,
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "keyframes", duration: 0.5 }}
                  dangerouslySetInnerHTML={{
                    __html: data?.details?.long_description,
                  }}
                  className="font-semibold text-heading inline-block pe-2"
                />
              )}
            </AnimatePresence>
          </div>
          <div className="w-full h-2 border-t mt-6 mb-6" />

          <div
            onClick={handleFilters("additionalInformation")}
            className="flex flex-col cursor-pointer"
          >
            <div className="w-full flex justify-between items-center">
              <span className="font-semibold text-heading inline-block pe-2">
                Additional Information
              </span>
              <span className={`font-semibold text-white text-[32px] `}>
                {filters?.additionalInformation ? "-" : "+"}
              </span>
            </div>
            <AnimatePresence>
              {filters?.additionalInformation && (
                <motion.span
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: 250,
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "keyframes", duration: 0.5 }}
                  dangerouslySetInnerHTML={{
                    __html: data?.details?.additional_info,
                  }}
                  className="font-semibold text-heading inline-block pe-2"
                />
              )}
            </AnimatePresence>
          </div>

          <div className="w-full h-2 border-t mt-6 mb-6" />
          <span className="font-semibold text-heading inline-block pe-2">
            Customer Reviews
          </span>
        </div>

      </div>
    </div>
  );
};

export default ProductSingleDetails;
