import Link from "@components/ui/link";
import Image from "next/image";
import { FC, useState } from "react";
import { useWindowSize } from "@utils/use-window-size";
import cn from "classnames";
import { LinkProps } from "next/link";
import { ROUTES } from "@utils/routes";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

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
  // const myLoader = ({ src }) => {
  // 	return `${API_ENDPOINTS.NEXT_PUBLIC_REST_ENDPOINT}/${src}`
  //   }

  const myLoader = ({ src }) => {
    return `https://portal.day2daywholesale.com/${selectedImage?.url}`;
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
              className="w-10 h-10 rounded-full bg-orange-500 text-black flex items-center justify-center absolute z-10 top-[40%] right-4 cursor-pointer  hover:scale-125 duration-200 transition"
            >
              <IoIosArrowForward />
            </motion.div>
          )}
        </AnimatePresence>
        <Image
          // loader={myLoader}
          // src={`${ROUTES.BANNER}/${selectedImage.url}`}
          // src={`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}${selectedImage.url}`}
          src={`https://portal.day2daywholesale.com/${selectedImage?.url}`}
          width={selectedImage.width}
          height={selectedImage.height}
          alt={title}
          loader={myLoader}
          quality={100}
        />
        <AnimatePresence>
          {showArrows && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-10 h-10 rounded-full bg-orange-500 text-black flex items-center justify-center absolute z-10 top-[40%] left-4 cursor-pointer  hover:scale-125 duration-200 transition rotate-180"
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
