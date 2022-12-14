import BannerCard from "@components/common/banner-card";
import Carousel from "@components/ui/carousel/carousel";
import { ROUTES } from "@utils/routes";
import { SwiperSlide } from "swiper/react";
import cn from "classnames";
import { title } from "process";

interface Props {
  data: any;
  className?: string;
  buttonGroupClassName?: string;
  variant?: "box" | "fullWidth";
  variantRounded?: "rounded" | "default";
}

const HeroSlider: React.FC<Props> = ({
  className = "mb-12 md:mb-14 xl:mb-[60px]",
  variant = "box",
  variantRounded = "rounded",
  buttonGroupClassName = "",
  data,
}) => {
  return (
    <div
      className={cn(
        " mb-5 md:mb-8 w-screen",
        {
          " ": variant === "fullWidth",
        },
        className
      )}
    >
      <Carousel
        autoplay={{
          delay: 5000,
        }}
        className={`mx-0 w-screen bg-transparent ${
          variant === "fullWidth" ? "carousel-full-width" : ""
        }`}
        // paginationPosition="left"
        prevButtonClasses="start-6 md:start-8 xl:start-12 2xl:start-16"
        nextButtonClasses="end-6 md:end-8 xl:end-12 2xl:end-16"
        buttonGroupClassName={buttonGroupClassName}
        nextActivateId="hero-slider-next"
        prevActivateId="hero-slider-prev"
        // pagination={{
        // 	clickable: true,
        // }}
      >
        {data?.map((banner: any) => (
          <SwiperSlide
            className="carouselItem"
            key={`banner--key-${banner?.id}`}
          >
            <BannerCard
              title={title}
              banner={banner}
              href={`${ROUTES.COLLECTIONS}/${banner.slug}`}
              variant={variantRounded}
            />
            <div className="absolute " id="test-para">
              <span>
                {banner.slider_title} <p>Hellow world</p>{" "}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroSlider;
