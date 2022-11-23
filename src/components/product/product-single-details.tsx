//@ts-nocheck

import React, { useState, useContext } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
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
import { userContext } from "@contexts/user.context";
import { useUI } from "@contexts/ui.context";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { colorsContext } from "@contexts/colors.context";

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
  const { openModal, setModalView } = useUI();
  const {
    name: userName,
    handleHideHeader,
    closeHideHeader,
  } = useContext(userContext);
  const { theme } = useContext(colorsContext);
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
  const [totalScrolled, setTotalScrolled] = useState(0);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState("");
  const [showFullScreen, setShowFullScreen] = useState<string | null>(null);

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
  const [variantPrice, setVariantPrice] = useState(0);

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

    const item = generateCartItem(
      {
        ...data?.details,
        discount_price: variantPrice
          ? variantPrice
          : data?.details?.discount_price,
      },
      attributes
    );

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

    setQuantitySelected((prev) => prev + 1);
  }

  function handleVariantData(data: any) {
    setVariantPrice(data?.variantprice);
  }

  function handleAttribute(attribute: any) {
    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
  }

  function renderTags() {
    const tags = data?.details?.product_tags?.split(",");

    return tags?.map((el: string, _i: number) => (
      <Link
        href={`/product/tagproduct/${el?.toLowerCase()?.split(" ")?.join("-")}`}
        className="inline-block pe-1.5 transition hover:underline last:pe-0"
      >
        {el}
      </Link>
    ));
  }

  const placeholderImage = `/assets/placeholder/products/product-gallery.svg`;

  const handleStarClick = (starName: string) => () => {
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
  };

  const leaveHover = (starName: string) => () => {
    if (clickedStar) return;
    setStars({ ...stars, [starName]: false });
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

  const sortvariantsLengths = getSortVariationsLength();

  const renderImage = () => {
    if (
      data?.details?.product_thumbnail?.toString()?.includes("shopify") ||
      data?.details?.product_thumbnail?.toString()?.includes("repziocdn")
    ) {
      return data?.details?.product_thumbnail;
    }

    return (
      `https://portal.day2daywholesale.com/public/assets/img/products/thumb/${data?.details?.product_thumbnail}` ??
      placeholderImage
    );
  };

  function handleViewPrice() {
    setModalView("LOGIN_VIEW");
    return openModal();
  }

  const handleScrollLeft = () => {
    const el = document.getElementById("gallery-images");
    let scrollAmount = totalScrolled;
    const sliderTimer = setInterval(() => {
      if (el) el.scrollLeft -= 12;
      scrollAmount -= 12;
      if (scrollAmount <= 0) {
        clearInterval(sliderTimer);
      }
    }, 15);

    setTotalScrolled(0);
    return true;
  };

  const handleScrollRight = () => {
    const el = document.getElementById("gallery-images");
    let scrollAmount = 0;
    const sliderTimer = setInterval(() => {
      if (el) el.scrollLeft += 12;
      scrollAmount += 12;
      if (scrollAmount >= 100) {
        setTotalScrolled(totalScrolled + scrollAmount);

        clearInterval(sliderTimer);
      }
    }, 15);

    return true;
  };

  const handleSelectGalleryImage = (uri) => () => {
    setSelectedGalleryImage(uri);
  };

  const galleryImageLoader = (picture) => () => {
    return `https://portal.day2daywholesale.com/public/assets/img/products/${picture}`;
  };

  const renderGalleryImage = () => {
    return data?.gallery?.map((el, i) => {
      return (
        <div
          onClick={handleSelectGalleryImage(el.pictures)}
          className="galleryImageCard"
        >
          <Image
            className="object-cover"
            src={`${el.pictures}`}
            alt="profile-image"
            layout="fill"
            loader={galleryImageLoader(el.pictures)}
          />
        </div>
      );
    });
  };

  const handleClickMainImage = () => {
    console.log("handle click main");
    handleHideHeader();

    if (selectedGalleryImage?.startsWith("https")) {
      setShowFullScreen(selectedGalleryImage);
      return;
    }

    if (selectedGalleryImage) {
      console.log(" im here inside this shit");
      console.log("selected gallery image: ", selectedGalleryImage);
      console.log(
        `https://portal.day2daywholesale.com/public/assets/img/products/${selectedGalleryImage}`
      );
      setShowFullScreen(
        `https://portal.day2daywholesale.com/public/assets/img/products/${selectedGalleryImage}`
      );
      return;
    }

    if (
      data?.details?.product_thumbnail?.toString()?.includes("shopify") ||
      data?.details?.product_thumbnail?.toString()?.includes("repziocdn")
    ) {
      setShowFullScreen(data?.details?.product_thumbnail);
      return;
      // return data?.details?.product_thumbnail;
    }

    setShowFullScreen(
      `https://portal.day2daywholesale.com/public/assets/img/products/thumb/${data?.details?.product_thumbnail}` ??
        placeholderImage
    );
  };

  if (showFullScreen) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col py-10">
        <div className="w-[80%] h-20 flex justify-end">
          <div
            onClick={() => {
              closeHideHeader();
              setShowFullScreen(null);
            }}
            className="flex rounded-full h-10 w-10 items-center justify-center bg-body z-50 text-gray-800 cursor-pointer"
          >
            <IoMdClose size={22} />
          </div>
        </div>
        <div className="relative w-[50rem] h-[50rem]">
          <Image
            className="object-contain"
            layout="fill"
            src={showFullScreen}
            loader={() => showFullScreen}
          />
        </div>
      </div>
    );
  }

  const renderSelectedImage = (): string => {
    console.log("selected gallery image");
    console.log(selectedGalleryImage);
    if (selectedGalleryImage?.includes("https")) {
      return selectedGalleryImage;
    }

    return `https://portal.day2daywholesale.com/public/assets/img/products/${selectedGalleryImage}`;
  };

  console.log("selected gallery image: ", selectedGalleryImage);

  return (
    <div className="block lg:grid grid-cols-9 gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20 items-start 2xl:pl-52 2xl:px-40">
      <React.Fragment>
        <div className="col-span-5 grid grid-cols-2 gap-2.5 ">
          <div className="col-span-2 transition duration-150 ease-in">
            <img
              src={selectedGalleryImage ? renderSelectedImage() : renderImage()}
              alt={`${data?.details?.product_name}`}
              className="object-cover w-full h-[80%] cursor-pointer"
              onClick={handleClickMainImage}
            />

            <div className="mt-4 flex relative items-center gap-4 ">
              {data?.gallery?.length ? (
                <div
                  style={{
                    backgroundColor: theme.backgroundColorSecondary,
                  }}
                  onClick={handleScrollLeft}
                  className="w-14 h-12 rounded-full ml-2 flex items-center justify-center  duration-300 transition cursor-pointer"
                >
                  <BiLeftArrowAlt size={32} />
                </div>
              ) : null}

              <div
                id="gallery-images"
                className="w-full flex gap-4 overflow-x-scroll hidescrollbar"
              >
                {renderGalleryImage()}
                <div
                  onClick={handleSelectGalleryImage(renderImage)}
                  className="galleryImageCard"
                >
                  <Image
                    className="object-cover"
                    src={renderImage()}
                    alt="profile-image"
                    layout="fill"
                    loader={renderImage}
                  />
                </div>
              </div>
              {data?.gallery?.length ? (
                <div
                  style={{
                    backgroundColor: theme.backgroundColorSecondary,
                  }}
                  onClick={handleScrollRight}
                  className="w-14 h-12 rounded-full  ml-2 flex items-center justify-center  duration-300 transition cursor-pointer"
                >
                  <BiLeftArrowAlt size={32} className="rotate-180" />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div
          style={{
            color: theme.textColor,
          }}
          className="col-span-4 pt-8 lg:pt-0"
        >
          <div
            style={{
              borderColor: theme.borderColor,
            }}
            className="pb-7 mb-7 border-b "
          >
            <h2 className="text- text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold  mb-3.5">
              {data?.details?.product_name}
            </h2>
            <p
              dangerouslySetInnerHTML={{
                __html: data?.details?.short_description,
              }}
              className="text-body text-sm lg:text-base leading-6 lg:leading-8"
            ></p>
            <div className="flex items-center mt-5">
              {userName ? (
                <React.Fragment>
                  <div className="text- font-bold text-base md:text-xl lg:text-2xl 2xl:text-4xl pe-2 md:pe-0 lg:pe-2 2xl:pe-0">
                    $
                    {variantPrice
                      ? variantPrice
                      : data?.details?.discount_price}
                    .00
                  </div>

                  <span className="line-through font-segoe text-gray-400 text-sm md:text-base lg:text-lg xl:text-xl ps-2">
                    ${data?.details?.selling_price}.00
                  </span>
                </React.Fragment>
              ) : (
                <div
                  onClick={handleViewPrice}
                  className="text-red-500 font-bold text-base cursor-pointer "
                >
                  View Price
                </div>
              )}
            </div>
          </div>

          {data?.sortvariants?.length ? (
            <div
              style={{
                borderColor: theme.borderColor,
              }}
              className="pb-3 border-b"
            >
              {data?.sortvariants?.map((variation: any) => {
                return (
                  <ProductAttributes
                    key={`popup-attribute-key${variation.id}`}
                    title={variation?.name}
                    attributes={variation?.size}
                    // attributes={variation.attributes}
                    active={attributes[variation?.name]}
                    onClick={handleAttribute}
                    handleVariant={handleVariantData}
                    data={variation}
                  />
                );
              })}
            </div>
          ) : null}

          <div
            style={{
              borderColor: theme.borderColor,
            }}
            className="flex items-center space-s-4 md:pe-32 lg:pe-12 2xl:pe-32 3xl:pe-48 border-b py-8"
          >
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
          <div
            style={{
              color: theme.textColor,
            }}
            className="py-6"
          >
            <ul className="text-sm space-y-5 pb-1">
              <li>
                <span className="font-semibold  inline-block pe-2">SKU:</span>
                {data?.details?.product_sku}
              </li>
              <li>
                <span className="font-semibold  inline-block pe-2">
                  Category:
                </span>
                <Link href="/" className="transition hover:underline ">
                  {data?.details?.category_name}
                </Link>
              </li>
              <span className="font-semibold  inline-block pe-2">Tags:</span>

              {renderTags()}
              <li>
                <span className="font-semibold  inline-block pe-2">
                  Quantity:
                </span>
                <span>{data?.details?.product_qty}</span>
              </li>
              <li>
                <span className="font-semibold text- inline-block pe-2">
                  Bar Code:
                </span>
                <span>{data?.details?.product_code}</span>
              </li>
            </ul>

            <div
              style={{
                borderColor: theme.borderColor,
              }}
              className="w-full h-2 border-t mt-6 mb-6 "
            />

            <div
              style={{
                color: theme.textColor,
              }}
              className="flex flex-col"
            >
              <div
                onClick={handleFilters("productDetails")}
                className="w-full flex justify-between items-center cursor-pointer"
              >
                <span className="font-semibold inline-block pe-2">
                  Product Details
                </span>
                <span className={`font-semibold  text-[32px] `}>
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
                    className="font-semibold  inline-block pe-2"
                  />
                )}
              </AnimatePresence>
            </div>
            <div
              style={{
                borderColor: theme.borderColor,
              }}
              className="w-full h-2 border-t mt-6 mb-6"
            />

            <div
              onClick={handleFilters("additionalInformation")}
              className="flex flex-col cursor-pointer"
            >
              <div className="w-full flex justify-between items-center">
                <span className="font-semibold  inline-block pe-2">
                  Additional Information
                </span>
                <span className={`font-semibold  text-[32px] `}>
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
                    className="font-semibold text- inline-block pe-2"
                  />
                )}
              </AnimatePresence>
            </div>

            <div
              style={{
                borderColor: theme.borderColor,
              }}
              className="w-full h-2 border-t mt-6 mb-6"
            />

            <div className="flex flex-col cursor-pointer">
              <div
                onClick={handleFilters("customerReviews")}
                className="w-full flex justify-between items-center"
              >
                <span className="font-semibold text- inline-block pe-2">
                  Customer Reviews
                </span>
                <span className={`font-semibold text- text-[32px] `}>
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
                      <span className=" text-sm  font-light  tracking-wider">
                        At first, Please check your internet connection . We
                        also have some online video tutorials regarding this
                        issue . If the problem remains, Please Open a ticket in
                        the support forum.
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
                        <span className="text-[15px]  font-semibold">
                          Name *
                        </span>
                        <input
                          value={valuesReview.name}
                          onChange={handleReview("name")}
                          className="w-full outline-none bg-gray-700 rounded-md px-4 py-3 text-white text-[15px]"
                        />
                      </div>
                      <div className="w-1/2 gap-2 flex-col flex">
                        <span className="text-[15px]  font-semibold">
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
      </React.Fragment>
    </div>
  );
};

export default ProductSingleDetails;

{
  /* <div className="relative w-full h-full">
  <Image
    className="object-contain"
    layout="fill"
    src={showFullScreen}
    loader={() => showFullScreen}
  />
</div>; */
}
