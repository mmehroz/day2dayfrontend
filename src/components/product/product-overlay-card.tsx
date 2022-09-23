import Image from 'next/image';
import { useUI } from '@contexts/ui.context';
import usePrice from '@framework/product/use-price';
import { Product } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

interface ProductProps {
  product: Product;
  index: number;
  imgLoading?: 'eager' | 'lazy';
  variant?: 'left' | 'center' | 'combined' | 'flat';
}

const ProductOverlayCard: React.FC<ProductProps> = ({
  product,
  index,
  variant = 'left',
  imgLoading = 'lazy',
}) => {
  let size = 260;
  let classes;

  // if (variant === "left" && index === 0) {
  // 	classes = "row-span-full lg:row-span-2 col-span-full lg:col-span-2";
  // 	size = 620;
  // } else if (variant === "center" && index === 1) {
  // 	classes = "row-span-full lg:row-span-2 col-span-full lg:col-span-2";
  // 	size = 620;
  // } else if (variant === "combined") {
  // 	if (index === 0) {
  // 		classes = "col-span-2 lg:row-span-2 col-span-full lg:col-span-2";
  // 		size = 620;
  // 	} else if (index === 2) {
  // 		classes = `col-span-2 lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-3`;
  // 		size = 620;
  // 	} else {
  // 		classes = "col-span-2 lg:col-span-1";
  // 	}
  // } else {
  // 	classes = "col-span-2 lg:col-span-1";
  // }

  if (variant === 'left' && index === 0) {
    classes = 'row-span-2 lg:row-span-1 col-span-full lg:col-span-1';
    size = 620;
  } else if (variant === 'center' && index === 1) {
    classes = 'row-span-1 lg:row-span-1 col-span-1 lg:col-span-1';
    size = 620;
  } else if (variant === 'combined') {
    if (index === 0) {
      classes = 'col-span-2 lg:row-span-1 col-span-full lg:col-span-1';
      size = 620;
    } else if (index === 2) {
      classes = `col-span-1 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3`;
      size = 620;
    } else {
      classes = 'col-span-1 lg:col-span-1';
    }
  } else {
    classes = 'col-span-1 lg:col-span-1';
  }

  const { openModal, setModalView, setModalData } = useUI();
  const { selling_price, purchase_price, discount_price } = usePrice({
    amount: product.sale_price ? product.sale_price : product.price,
    baseAmount: product.price,
    currencyCode: 'USD',
  });
  function handlePopupView() {
    setModalData({ data: product });
    setModalView('PRODUCT_VIEW');
    return openModal();
  }
  const placeholderImage = `/assets/placeholder/products/product-${variant}.svg`;

  const myLoader = ({ src }) => {
    return `${API_ENDPOINTS.NEXT_PUBLIC_REST_ENDPOINT}/public/assets/img/products/thumb/${src}`;
  };

  return (
    <div
      onClick={handlePopupView}
      className={`${classes} cursor-pointer group flex flex-col bg-gray-650 rounded-md relative items-center justify-between overflow-hidden`}
    >
      <div
        className="flex justify-center items-center p-4 h-full 3xl:min-h-[330px]"
        title={product?.name}
      >
        <Image
          loader={myLoader}
          src={product?.product_thumbnail || placeholderImage}
          width={size}
          height={size}
          loading={imgLoading}
          alt={product?.product_name || 'Product Image'}
          className="transition duration-500 ease-in-out transform group-hover:scale-110"
        />
      </div>
      {product.discount_price && (
        <span className="absolute top-3.5 md:top-5 3xl:top-7 start-3.5 md:start-5 3xl:start-7 text-gray-500 bg-gradient-to-r from-orange-500 to-pink-500 text-10px md:text-sm leading-5 rounded-xl inline-block px-2 xl:px-3 pt-0.5 pb-1">
          {product.discount_price}
        </span>
      )}

      <div
        className="flex flex-col md:flex-row  2xl:flex-row md:justify-between md:items-center lg:items-start 2xl:items-center w-full px-4 md:px-5 3xl:px-7 pb-4 md:pb-5 3xl:pb-7"
        title={product?.product_name}
      >
        <div className="md:pe-2 lg:pe-0 2xl:pe-2 overflow-hidden ">
          <h2 className="text-white font-semibold text-sm md:text-base xl:text-lg mb-1 truncate">
            {product?.product_name}
          </h2>

          <p className="text-white text-xs xl:text-sm leading-normal xl:leading-relaxed truncate max-w-[250px]">
            {product?.short_description}
          </p>
        </div>
        <div className="flex-shrink-0 flex md:flex-col  2xl:flex-col items-center md:items-end lg:items-start 2xl:items-end justify-end md:text-end lg:text-start xl:text-end mt-2 md:-mt-0.5 lg:mt-2 2xl:-mt-0.5">
          {product.discount_price && (
            <del className="text-sm md:text-base lg:text-sm xl:text-base 3xl:text-lg">
              {product.purchase_price}
            </del>
          )}
          <div className=" text-white font-segoe font-semibold text-base md:text-xl lg:text-base xl:text-xl 3xl:text-2xl 3xl:mt-0.5 pe-2 md:pe-0 lg:pe-2 2xl:pe-0">
            {product.selling_price}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverlayCard;
