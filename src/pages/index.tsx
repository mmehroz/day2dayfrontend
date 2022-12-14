//@ts-nocheck
import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Divider from "@components/ui/divider";
import ProductsFeatured from "@containers/products-featured";
import Subscription from "@components/common/subscription";
import NewArrivalsProductFeed from "@components/product/feeds/new-arrivals-product-feed";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import HeroSlider from "@containers/hero-slider";
import { homeElegantHeroSlider as banners } from "@framework/static/banner";
import BannerBlock from "@containers/banner-block";
import { bannerDataThree } from "@framework/static/banner";
import CategoryBlockIcon from "@containers/category-block-icon";
import ProductsFlashSaleCarousel from "@containers/product-flash-sale-carousel";
import BrandBlock from "@containers/brand-block";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useRouter } from "next/router";

import React, { useEffect, useState, useContext } from "react";

import axios from "axios";
import { useQuery } from "react-query";
import { colorsContext } from "@contexts/colors.context";

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [bannersBlock, setBannersBlock] = useState([]);
  const { theme } = useContext(colorsContext);

  const getBanners = () => {
    return (
      http
        .get(API_ENDPOINTS.BANNER)
        // axios("http://127.0.0.1:8000/api/slider")
        .then((response) => {
          setBanners(response.data.data);
          // (response.data.data);
        })
        .catch((err) => {})
    );
  };

  const getBannerBlock = async () => {
    try {
      const promises: any[] = [];
      const data = [
        "https://portal.day2daywholesale.com/api/slider/type=2",
        "https://portal.day2daywholesale.com/api/slider/type=3",
        "https://portal.day2daywholesale.com/api/slider/type=4",
      ];

      data.forEach((el) => {
        const promise = axios(el);
        promises.push(promise);
      });

      const res = await Promise.all(promises);

      const sorted = res?.map((el, i) => {
        return {
          ...el?.data?.data[0],
          additionImage: el?.data?.data[1]?.additionalimages,
          type: i === 0 ? "medium" : "small",
        };
      });

      //@ts-ignore
      setBannersBlock(sorted);
    } catch (err) {}
  };

  useEffect(() => {
    let subscribe: boolean = false;

    if (subscribe) return;

    axios("https://portal.day2daywholesale.com/api/webvisitors")
      .then((res) => {})
      .catch((err) => {});

    return () => {
      subscribe = true;
    };
  }, []);

  useEffect(() => {
    getBannerBlock().catch((err) => {});
    getBanners().catch((err) => {});
  }, []);

  // useEffect(() => {
  // 	(banners);
  // 	getBanners();
  //   });

  return (
    <>
      <HeroSlider data={banners} variantRounded="default" variant="fullWidth" />

      <Container>
        <BannerBlock data={bannersBlock} className="mb-12 md:mb-14 xl:mb-16" />
        <CategoryBlockIcon
          sectionHeading="text-browse-categories"
          variant="modern"
        />
        {/* <CategoryBlock sectionHeading="text-shop-by-category" type="rounded" /> */}

        {/* <ProductsFeatured sectionHeading="text-featured-products" limit={5} /> */}
        <ProductsFeatured
          limit={4}
          variant="combined"
          sectionHeading="text-featured-products"
        />
        <ProductsFlashSaleCarousel />
        <NewArrivalsProductFeed />
        <BrandBlock sectionHeading="text-top-brands" />
        {/* <ProductsFlashSaleBlock date={"2023-03-01T01:02:03"} /> */}
      </Container>
      {/* <BannerSliderBlock /> */}
      <Container>
        {/*	
				
				<BannerCard
					key={`banner--key${banner[0].id}`}
					banner={banner[0]}
					href={`${ROUTES.COLLECTIONS}/${banner[0].slug}`}
					className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
				/>
				 <BrandGridBlock sectionHeading="text-top-brands" />
				<BannerCard
					key={`banner--key${banner[1].id}`}
					banner={banner[1]}
					href={`${ROUTES.COLLECTIONS}/${banner[1].slug}`}
					className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
				/>
				<BannerWithProducts
					sectionHeading="text-on-selling-products"
					categorySlug="/search"
				/>
				<ExclusiveBlock />
				
				<DownloadApps />
				<Support />
				<Instagram /> */}
        <Subscription className="bg-opacity-0 px-5 sm:px-16 xl:px-0 py-12 md:py-14 xl:py-16" />
      </Container>
      {/* <Divider className="mb-0" /> */}
    </>
  );
}

Home.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};
