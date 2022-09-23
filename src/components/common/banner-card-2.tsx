import Link from "@components/ui/link";
import Image from "next/image";
import type { FC } from "react";
import { useWindowSize } from "@utils/use-window-size";
import cn from "classnames";
import { LinkProps } from "next/link";
import { ROUTES } from "@utils/routes";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";





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
	// const myLoader = ({ src }) => {
	// 	return `${API_ENDPOINTS.NEXT_PUBLIC_REST_ENDPOINT}/${src}`
	//   }
	return (
		<div className={cn("mx-auto", className)}>
			<Link
				href={href}
				className={cn(
					"h-full group flex justify-center relative overflow-hidden",
					classNameInner
				)}
			>
				<Image
					// loader={myLoader}
					// src={`${ROUTES.BANNER}/${selectedImage.url}`}
					// src={`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}${selectedImage.url}`}
					src={selectedImage.url}
					width={selectedImage.width}
					height={selectedImage.height}
					alt={title}
					quality={100}
					className={cn("bg-gray-300 object-cover w-full", {
						"rounded-md": variant === "rounded",
					})}
				/>
				{effectActive && (
					<div className="absolute top-0 -start-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
				)}
				
			</Link>
		</div>
	);
};

export default BannerCard2;
