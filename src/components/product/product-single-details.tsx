//@ts-nocheck

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
import { AiFillStar } from "react-icons/ai";
import axios from "axios";

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
  const [quantitySelected, setQuantitySelected] = useState(0);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [stars, setStars] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [clickedStar, setClickedStar] = useState(false);

  const [valuesReview, setValuesReview] = useState({
    rating: 0,
    message: "",
    name: "",
    email: "",
  });

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

  const handleReview = (name: string) => (e: any) => {
    setValuesReview({ ...valuesReview, [name]: e.target.value });
  };

  const handleFilters = (value: string) => () => {
    setFilters({ ...filters, [value]: !filters[value] });
  };

  const getSortVariationsLength = () => {
    let counter = 0;
    data?.sortvariants?.map((el, i) => {
      if (el?.name) {
        counter++;
      }
    });

    return counter;
  };

  function addToCart() {
    if (Object.keys(attributes)?.length !== sortvariantsLengths) return;
    // to show btn feedback while product carting
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 600);

    const item = generateCartItem(data?.details, attributes);

    if (
      quantitySelected >= parseInt(data?.details?.product_qty) ||
      quantity >= parseInt(data?.details?.product_qty)
    ) {
      toast("Maximum Quantity Reached", {
        progressClassName: "fancy-progress-bar",
        position: width > 768 ? "bottom-right" : "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

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
    setQuantitySelected((prev) => prev + 1);
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

  const handleStarClick = (starName: string) => () => {
    console.log("clicking: ", starName);
    let data = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
    };

    for (let i = 0; i <= parseInt(starName); i++) {
      data[i] = true;
    }

    console.log("click star: ", data);
    setStars({ ...data });
    setClickedStar(true);
  };

  const starHover = (starName: string) => () => {
    let data = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
    };

    for (let i = 0; i <= parseInt(starName); i++) {
      data[i] = true;
    }

    setStars(data);
    console.log("hover start: ", data);
  };

  const leaveHover = (starName: string) => () => {
    if (clickedStar) return;
    setStars({ ...stars, [starName]: false });
    console.log("leave hover: ");
  };

  function renderStars() {
    const starsData = [
      { 0: false },
      { 1: false },
      { 2: false },
      { 3: false },
      { 4: false },
    ];

    return starsData.map((el, i) => {
      if (stars[i]) {
        return (
          <AiFillStar
            className="text-orange-500"
            onMouseEnter={starHover(i.toString())}
            onMouseLeave={leaveHover(i.toString())}
            onClick={handleStarClick(i.toString())}
          />
        );
      }

      return <AiFillStar className="" onMouseEnter={starHover(i.toString())} />;
    });
  }

  const handleSubmitReview = async () => {
    try {
      let rating = 0;

      for (let i = 0; i <= 4; i++) {
        if (stars[i]) {
          rating = i;
        }
      }

      console.log("isRating: ", rating);
      if (!valuesReview.message) throw new Error("Message field required");

      if (!valuesReview.name) throw new Error("Name field required");
      if (!valuesReview.email) throw new Error("Email field required");

      await axios("https://portal.day2daywholesale.com/api/review", {
        method: "POST",
        data: {
          review_rating: rating + 1,
          review_message: valuesReview?.message,
          review_name: valuesReview?.name,
          review_email: valuesReview?.email,
        },
      });
      toast("Review Submitted", {
        progressClassName: "fancy-progress-bar",
        position: width > 768 ? "bottom-right" : "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setValuesReview({
        message: "",
        name: "",
        rating: 0,
        email: "",
      });
    } catch (err) {
      toast(err?.message, {
        progressClassName: "fancy-progress-bar",
        position: width > 768 ? "bottom-right" : "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  console.log("data: ", data);
  console.log("object keys: ", Object.keys(attributes)?.length);
  console.log("sort variatns: ", data?.sortvariants?.length);

  const sortvariantsLengths = getSortVariationsLength();

  const renderImage = () => {
    if (data?.details?.product_thumbnail?.toString()?.includes("shopify") || data?.details?.product_thumbnail?.toString()?.includes('repziocdn')) {
      return data?.details?.product_thumbnail;
    }

    return (
      `https://portal.day2daywholesale.com/public/assets/img/products/thumb/${data?.details?.product_thumbnail}` ??
      placeholderImage
    );
  };

  return (
    <div className="block lg:grid grid-cols-9 gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20 items-start 2xl:pl-52 2xl:px-40">
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
              src={renderImage()}
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
              ${data?.details?.discount_price}.00
            </div>

            <span className="line-through font-segoe text-gray-400 text-sm md:text-base lg:text-lg xl:text-xl ps-2">
              ${data?.details?.selling_price}.00
            </span>
          </div>
        </div>

        {data?.sortvariants?.length ? (
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
        ): null}

        <div className="flex items-center space-s-4 md:pe-32 lg:pe-12 2xl:pe-32 3xl:pe-48 border-b border-gray-300 py-8">
          <Counter
            quantity={quantity}
            onIncrement={() => {
              if (quantity >= parseInt(data?.details?.product_qty)) return;

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
            className="w-full md:w-6/12 xl:w-full bg-gradient-to-tr from-orange-800 to-orange-500  animate-shine"
            loading={addToCartLoader}
            disabled={
              Object.keys(attributes)?.length !== sortvariantsLengths ||
              quantity >= parseInt(data?.details?.product_qty) ||
              quantitySelected >= parseInt(data?.details?.product_qty)
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
                    height: data?.details?.long_description?.length - 450,
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

          <div className="flex flex-col cursor-pointer">
            <div
              onClick={handleFilters("customerReviews")}
              className="w-full flex justify-between items-center"
            >
              <span className="font-semibold text-heading inline-block pe-2">
                Customer Reviews
              </span>
              <span className={`font-semibold text-white text-[32px] `}>
                {filters?.customerReviews ? "-" : "+"}
              </span>
            </div>
            <AnimatePresence>
              {filters?.customerReviews && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 600, opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "keyframes", duration: 0.5 }}
                  className="flex flex-col"
                >
                  <div className="w-full flex mt-10">
                    <span className="text-white/80 text-sm  font-light  tracking-wider">
                      At first, Please check your internet connection . We also
                      have some online video tutorials regarding this issue . If
                      the problem remains, Please Open a ticket in the support
                      forum.
                    </span>
                  </div>

                  <span className="text-[15px] mt-10">Your Rating *</span>
                  <div className="flex flex-row gap-1 mt-4">
                    {renderStars()}
                  </div>
                  <div className="w-full flex flex-col mt-10 gap-2">
                    <span className="text-[15px]">Message *</span>
                    <textarea
                      value={valuesReview.message}
                      onChange={handleReview("message")}
                      rows={4}
                      cols={4}
                      className="w-full outline-none bg-gray-700 rounded-md px-4 py-2 text-white text-[15px]"
                    />
                  </div>
                  <div className="w-full flex mt-10 gap-4">
                    <div className="w-1/2 gap-2 flex-col flex">
                      <span className="text-[15px] text-white font-semibold">
                        Name *
                      </span>
                      <input
                        value={valuesReview.name}
                        onChange={handleReview("name")}
                        className="w-full outline-none bg-gray-700 rounded-md px-4 py-3 text-white text-[15px]"
                      />
                    </div>
                    <div className="w-1/2 gap-2 flex-col flex">
                      <span className="text-[15px] text-white font-semibold">
                        Email *
                      </span>
                      <input
                        value={valuesReview.email}
                        onChange={handleReview("email")}
                        className="w-full outline-none bg-gray-700 rounded-md px-4 py-3 text-white text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="mt-10 w-[10rem]">
                    <Button
                      onClick={handleSubmitReview}
                      variant="slim"
                      className="w-full md:w-6/12 xl:w-full bg-gradient-to-tr from-orange-800 to-orange-500  animate-shine"
                    >
                      <span className="py-2 3xl:px-8">Submit</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSingleDetails;
