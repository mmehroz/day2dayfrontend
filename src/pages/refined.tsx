import Container from "@components/ui/container";
import Layout from "@components/layout/layout-two";
import { GetStaticProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { fetchFlashSaleProducts } from "@framework/product/get-all-flash-sale-products";
import { fetchCategories } from "@framework/category/get-all-categories";
import { fetchNewArrivalProducts } from "@framework/product/get-all-new-arrival-products";
import { fetchBrands } from "@framework/brand/get-all-brands";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CategoryBlockIcon from "@containers/category-block-icon";
import { ROUTES } from "@utils/routes";
import ProductsFlashSaleCarousel from "@containers/product-flash-sale-carousel";
import NewArrivalsProductFeed from "@components/product/feeds/new-arrivals-product-feed";
import BannerCard from "@components/common/banner-card";
import SaleBannerWithProducts from "@containers/sale-banner-with-products";
import TestimonialCarousel from "@containers/testimonial-carousel";
import SubscriptionWithBg from "@components/common/subscription-with-bg";
import CollectionBlock from "@containers/collection-block";
import ProductsTopBlock from "@containers/products-top-block";
import { collectionModernData as collection } from "@framework/static/collection";
import { homeEightCoupons as banner } from "@framework/static/banner";
import { homeEightWinterBanner as bannerWinter } from "@framework/static/banner";
import { bannerDataFour, bannerDataFourMobile } from "@framework/static/banner";
import BannerBlock from "@containers/banner-block";
import BrandBlock from "@containers/brand-block";
import HeroWithCategory from "@containers/hero-with-category";
import Instagram from "@components/common/instagram";
import ProductsFeatured from "@containers/products-featured";
import { homeEightHeroBanner as heroBanner } from "@framework/static/banner";

export default function Home() {
  return (
    <>
      <div></div>
    </>
  );
}
