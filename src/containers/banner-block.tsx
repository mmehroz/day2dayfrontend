//@ts-nocheck
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
  const [intervalTrigger1, setIntervalTrigger1] = useState(0);
  const [intervalTrigger2, setIntervalTrigger2] = useState(0);

  useEffect(() => {
    let timeout = setInterval(() => {
      setIntervalTrigger(intervalTrigger + 1);
    }, 5000);

    return () => {
      clearInterval(timeout);
    };
  }, [intervalTrigger]);

  useEffect(() => {
    let timeout = setInterval(() => {
      setIntervalTrigger1(intervalTrigger1 + 1);
    }, 4000);

    return () => {
      clearInterval(timeout);
    };
  }, [intervalTrigger1]);

  useEffect(() => {
    let timeout = setInterval(() => {
      setIntervalTrigger2(intervalTrigger2 + 1);
    }, 3000);

    return () => {
      clearInterval(timeout);
    };
  }, [intervalTrigger2]);

  return (
    <div
      className={`${className} grid grid-cols-2 sm:grid-cols-9 gap-2 md:gap-2.5 max-w-[1920px] mx-auto`}
    >
      {data.map((banner: any, index) => (
        <BannerCard2
          key={index}
          intervalTrigger={intervalTrigger}
          intervalTrigger1={intervalTrigger1}
          intervalTrigger2={intervalTrigger2}
          banner={banner[0]}
          href={`${ROUTES.COLLECTIONS}/${banner.slug}`}
          effectActive={true}
          additionalImage={banner["additionImage"]}
          variant="default"
          index={index}
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
