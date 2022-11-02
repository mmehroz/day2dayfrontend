import Carousel from "@components/ui/carousel/carousel";
import ProductCard from "@components/product/product-card";
import SectionHeader from "@components/common/section-header";
import ProductCardGridLoader from "@components/ui/loaders/product-card-grid-loader";
import { useFlashSaleProductsQuery } from "@framework/product/get-all-flash-sale-products";
import Alert from "@components/ui/alert";
import { SwiperSlide } from "swiper/react";

interface ProductsProps {
  sectionHeading?: string;
  className?: string;
  date?: any;
}

const breakpoints = {
  "1500": {
    slidesPerView: 6,
    spaceBetween: 28,
  },
  "1025": {
    slidesPerView: 5,
    spaceBetween: 20,
  },
  "768": {
    slidesPerView: 3,
    spaceBetween: 20,
  },
  "480": {
    slidesPerView: 3,
    spaceBetween: 12,
  },
  "0": {
    slidesPerView: 2,
    spaceBetween: 12,
  },
};

const ProductsFlashSaleCarousel: React.FC<ProductsProps> = ({
  sectionHeading = "text-flash-sale",
  className = "mb-10 md:mb-12 xl:mb-14",
}) => {
  const { data, isLoading, error } = useFlashSaleProductsQuery({
    limit: 10,
  });
  // (data, 'data');
  return (
    <div className={`${className} 2xl:pt-2`}>
      <div className=" justify-between items-center flex-wrap mb-5 md:mb-6 hidden sm:flex">
        <SectionHeader sectionHeading={sectionHeading} className="mb-0" />
      </div>
      {error ? (
        <Alert message={error?.message} />
      ) : (
        <Carousel
          autoplay={{
            delay: 3500,
          }}
          breakpoints={breakpoints}
          buttonGroupClassName="-mt-10 md:-mt-12 xl:-mt-14"
        >
          {isLoading && data?.length
            ? Array.from({ length: 10 }).map((_, idx) => (
                <ProductCardGridLoader
                  key={idx}
                  uniqueKey={`flash-sale-${idx}`}
                />
              ))
            : data?.map((product: any) => (
                <SwiperSlide key={`product--key-${product.id}`}>
                  <ProductCard
                    product={product}
                    imgWidth={335}
                    imgHeight={335}
                    variant="gridSlim"
                  />
                </SwiperSlide>
              ))}
        </Carousel>
      )}
    </div>
  );
};

export default ProductsFlashSaleCarousel;
