import { FC, useEffect, useState } from "react";
import { useWindowSize } from "@utils/use-window-size";
import cn from "classnames";
import { LinkProps } from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence, animate } from "framer-motion";

interface BannerProps {
  banner: any;
  variant?: "rounded" | "default";
  effectActive?: boolean;
  className?: string;
  classNameInner?: string;
  href: LinkProps["href"];
  additionalImage: any;
  intervalTrigger: any;
  intervalTrigger1: any;
  intervalTrigger2: any;
  index: any;
}

function getImage(deviceWidth: number, imgObj: any) {
  return 300;
}

const BannerCard2: FC<BannerProps> = ({
  banner,
  variant = "rounded",
  effectActive = false,
  classNameInner,
  href,
  additionalImage,
  intervalTrigger,
  intervalTrigger1,
  intervalTrigger2,
  index: componentIndex,
}) => {
  const { width } = useWindowSize();
  const { title, image } = banner;
  const selectedImage = getImage(width, image);
  console.log("selected image: ", selectedImage?.url);
  const [showArrows, setShowArrows] = useState(false);
  const [imageRender, setImageRender] = useState({
    image: selectedImage?.url,
    index: -1,
  });
  const [animateImageType, setAnimateImageType] = useState<string | null>(
    "right"
  );

  useEffect(() => {
    setImageRender({
      image: selectedImage?.url,
      index: -1,
    });
  }, [selectedImage?.url]);

  useEffect(() => {
    if (!additionalImage?.length) return;

    if (componentIndex == 1) {
      handleNextImage();
    }
  }, [componentIndex, additionalImage, intervalTrigger1]);

  useEffect(() => {
    if (!additionalImage?.length) return;
    console.log("interval triggering");
    if (componentIndex === 0) {
      handleNextImage();
    }
  }, [intervalTrigger, additionalImage, componentIndex]);

  useEffect(() => {
    if (!additionalImage?.length) return;
    console.log("interval triggering");
    if (componentIndex === 2) {
      handleNextImage();
    }
  }, [intervalTrigger2, additionalImage, componentIndex]);

  function handleNextImage() {
    console.log("handle next image calling");
    const totalAdditionalImages = additionalImage?.length;
    let index = null;

    index =
      imageRender?.index + 1 < totalAdditionalImages
        ? imageRender?.index + 1
        : imageRender?.index - (totalAdditionalImages - 1);

    if (imageRender?.index === -1 && totalAdditionalImages > 0) {
      index = 0;
    }

    setImageRender({
      image: additionalImage[index],
      index: index,
    });
    setAnimateImageType("right");
  }

  const handlePrevImage = () => {
    const totalAdditionalImages = additionalImage?.length;
    let index = null;

    index =
      imageRender?.index < totalAdditionalImages
        ? imageRender?.index === 0
          ? totalAdditionalImages - 1
          : imageRender?.index - 1
        : imageRender?.index - (totalAdditionalImages - 1);

    if (imageRender?.index === -1 && totalAdditionalImages > 0) {
      index = totalAdditionalImages - 1;
    }

    console.log("index here: ", index);

    setImageRender({
      image: additionalImage[index],
      index: index,
    });
    setAnimateImageType("left");
  };

  return (
    <div
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div
        // href={href}
        className={cn(
          "h-full flex justify-center relative overflow-hidden w-[27rem] 2xl:w-[33rem] ",
          classNameInner
        )}
      >
        <AnimatePresence>
          {showArrows && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleNextImage}
              className="w-10 h-10 rounded-full bg-orange-500 text-black flex items-center justify-center absolute z-10 top-[45%] right-4 cursor-pointer  hover:scale-125 duration-200 transition"
            >
              <IoIosArrowForward />
            </motion.div>
          )}
        </AnimatePresence>
        {imageRender?.image && (
          <motion.img
            src={`https://portal.day2daywholesale.com/${imageRender?.image}`}
            style={{
              height: 350,
              widows: 600,
            }}
            alt={title}
            initial={{
          
              x: animateImageType === "left" ? "100%" : "-100%",
            }}
            animate={{  x: "0%" }}
            key={imageRender?.image}
            transition={{
              type: "keyframes",
            }}
            className="object-cover rounded-xl w-full"
          />
        )}

        <AnimatePresence>
          {showArrows && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handlePrevImage}
              className="w-10 h-10 rounded-full bg-orange-500 text-black flex items-center justify-center absolute z-10 top-[45%] left-4 cursor-pointer  hover:scale-125 duration-200 transition rotate-180"
            >
              <IoIosArrowForward />
            </motion.div>
          )}
        </AnimatePresence>

        
      </div>
    </div>
  );
};

export default BannerCard2;
