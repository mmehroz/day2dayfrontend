import SectionHeader from "@components/common/section-header";
import ProductOverlayCard from "@components/product/product-overlay-card";
import { useFeaturedProductsQuery } from "@framework/product/get-all-featured-products";
import Alert from "@components/ui/alert";
import { Product } from "@framework/types";
import ProductOverlayCardBackup from "@components/product/product-overlay-card-backup";

interface ProductsProps {
	sectionHeading: string;
	categorySlug?: string;
	className?: string;
	limit?: number;
	singlelimit?: number;
	variant?: "left" | "center" | "combined" | "flat";
}

const ProductsFeatured: React.FC<ProductsProps> = ({
	sectionHeading,
	categorySlug,
	className = "mb-12 md:mb-14 xl:mb-16",
	variant = "left",
	limit = 4,
	singlelimit = 1,
}) => {
	const { data, error } = useFeaturedProductsQuery({
		limit: limit,
	});
 
	return (
		<div className={className}>
			<SectionHeader
				sectionHeading={sectionHeading}
				categorySlug={categorySlug}
			/>
			{error ? (
				<Alert message={error?.message} />
			) : (
				// <div className="first-letter:grid-cols-2">
				<div className="first-letter:grid-cols-2">

					{/* <div className="grid grid-rows-full  gap-3 md:gap-5 xl:gap-7 float-left lg:mr-8" style={{maxHeight:'480px'}}> */}
					<div className="grid grid-rows-full gap-3 md:max md:gap-5 xl:gap-7 float-left lg:mr-8">
						{data?.slice(0, singlelimit).map((product: Product, idx: number) => (
							<ProductOverlayCardBackup
								key={`product--key${product.id}`}
								product={product}
								variant={variant}
								index={idx}
							/>
						))}
					</div>
					<div className="grid grid-rows-2 gap-3 md:gap-5 xl:gap-7">
						{data?.slice(1, limit).map((product: Product, idx: number) => (
							<ProductOverlayCard
								key={`product--key${product.id}`}
								product={product}
								variant={variant}
								index={idx}
								
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductsFeatured;
