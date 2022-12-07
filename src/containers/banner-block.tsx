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
    }, 10000);

    return () => {
      clearInterval(timeout);
    };
  }, [intervalTrigger]);

  useEffect(() => {
    let timeout = setInterval(() => {
      setIntervalTrigger1(intervalTrigger1 + 1);
    }, 8000);

    return () => {
      clearInterval(timeout);
    };
  }, [intervalTrigger1]);

  useEffect(() => {
    let timeout = setInterval(() => {
      setIntervalTrigger2(intervalTrigger2 + 1);
    }, 5000);

    return () => {
      clearInterval(timeout);
    };
  }, [intervalTrigger2]);

  console.log("data banner: ", data)

  return (
    <div
      className={`w-full flex justify-between gap-4 mb-10`}
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
         
        />
      ))}
    </div>
  );
};

export default BannerBlock;
