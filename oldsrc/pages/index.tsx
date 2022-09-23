// import BannerCard from "@components/common/banner-card";
// import BrandGridBlock from "@containers/brand-grid-block";
// import CategoryBlock from "@containers/category-block";
// import BannerWithProducts from "@containers/banner-with-products";
// import DownloadApps from "@components/common/download-apps";
// import Support from "@components/common/support";
// import Instagram from "@components/common/instagram";
// import ProductsFlashSaleBlock from "@containers/product-flash-sale-block";
// import BannerSliderBlock from "@containers/banner-slider-block";
// import ExclusiveBlock from "@containers/exclusive-block";
// import { homeThreeBanner as banner } from "@framework/static/banner";
// import { homeThreeMasonryBanner as masonryBanner } from "@framework/static/banner";
// import { ROUTES } from "@utils/routes";

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


import React, { useEffect, useState } from "react";


import axios from "axios";
import { useQuery } from "react-query";






export default function Home() {

	const [banners, setBanners] = useState([]);

	const getBanners = () => {
		return http.get(API_ENDPOINTS.BANNER)
		// axios("http://207.244.250.143/day2day/api/slider") 
		.then(
			(response) => {
				setBanners(response.data.data);
		// console.log(response.data.data);
				
			}	
		)
	}
	useEffect(() => {
		getBanners();
		console.log(banners);

	  }, []);
	  
	// useEffect(() => {
	// 	console.log(banners);
	// 	getBanners();
	//   });
	
	return (
		<>
			
			<HeroSlider data={banners} variantRounded="default" variant="fullWidth" />

			
			<Container>
			<BannerBlock
					data={bannerDataThree}
					className="mb-12 md:mb-14 xl:mb-16"
				/>
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
