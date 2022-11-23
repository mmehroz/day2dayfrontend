import React, { useEffect, useState } from "react";
import BannerCard2 from "@components/common/banner-card-2";
import { ROUTES } from "@utils/routes";
import { SwiperSlide } from "swiper/react";
interface BannerProps {
  data: any;
  className?: string;
}

const BannerBlock: React.FC<BannerProps> = ({
  data,
  className = "mb-12 md:mb-14 xl:mb-16 px-2.5",
}) => {
  const [intervalTrigger, setIntervalTrigger] = useState(0);
  console.log("banner-block data: ", data);

  useEffect(() => {
    let timeout = setInterval(() => {
      setIntervalTrigger(intervalTrigger + 1);
    }, 5000);

    return () => {
      clearInterval(timeout);
    };
  }, [intervalTrigger]);

  return (
    <div
      className={`${className} grid grid-cols-2 sm:grid-cols-9 gap-2 md:gap-2.5 max-w-[1920px] mx-auto`}
    >
      {data.map((banner: any) => (
        <BannerCard2
          key={`banner--key${banner.id}`}
          intervalTrigger={intervalTrigger}
          banner={banner[0]}
          href={`${ROUTES.COLLECTIONS}/${banner.slug}`}
          effectActive={true}
          additionalImage={banner["additionImage"]}
          variant="default"
          className={
            banner.type === "medium"
              ? "col-span-full sm:col-span-5"
              : "col-span-1 sm:col-span-2"
          }
        />
      ))}
    </div>
  );
};

export default BannerBlock;
