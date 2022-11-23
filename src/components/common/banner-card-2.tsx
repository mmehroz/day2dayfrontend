import Link from "@components/ui/link";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { useWindowSize } from "@utils/use-window-size";
import cn from "classnames";
import { LinkProps } from "next/link";
import { ROUTES } from "@utils/routes";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence, animate } from "framer-motion";

interface BannerProps {
  banner: any;
  variant?: "rounded" | "default";
  effectActive?: boolean;
  className?: string;
  classNameInner?: string;
  href: LinkProps["href"];
}

function getImage(deviceWidth: number, imgObj: any) {
  return deviceWidth < 480 ? imgObj.mobile : imgObj.desktop;
}

const BannerCard2: FC<BannerProps> = ({
  banner,
  className,
  variant = "rounded",
  effectActive = false,
  classNameInner,
  href,
}) => {
  const { width } = useWindowSize();
  const { title, image } = banner;
  const selectedImage = getImage(width, image);
  const [showArrows, setShowArrows] = useState(false);
  const [imageRender, setImageRender] = useState(selectedImage?.url);
  const [animateImageType, setAnimateImageType] = useState<string | null>(
    "right"
  );

  useEffect(() => {
    console.log("image url 44: ", selectedImage?.url);
    setImageRender(selectedImage?.url);
  }, [selectedImage?.url]);
  // const myLoader = ({ src }) => {
  // 	return `${API_ENDPOINTS.NEXT_PUBLIC_REST_ENDPOINT}/${src}`
  //   }

  const handleNextImage = () => {
    setImageRender("public/assets/img/sliders/1746667599147418.jfif");
    setAnimateImageType("right");
  };

  const handlePrevImage = () => {
    setImageRender("public/assets/img/sliders/1746667635452801.jfif");
    setAnimateImageType("left");
  };

  return (
    <div
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
      className={cn("mx-auto", className)}
    >
      <div
        // href={href}
        className={cn(
          "h-full group flex justify-center relative overflow-hidden ",
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
        {imageRender && (
          <motion.img
            src={`https://portal.day2daywholesale.com/${imageRender}`}
            width={selectedImage.width}
            height={selectedImage.height}
            alt={title}
            initial={{
              opacity: 0,
              x: animateImageType === "left" ? "100%" : "-100%",
            }}
            animate={{ opacity: 1, x: "0%" }}
            key={imageRender}
            transition={{
              type: "keyframes",
            }}
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

        {effectActive && (
          <div className="absolute top-0 -start-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
        )}
      </div>
    </div>
  );
};

export default BannerCard2;
