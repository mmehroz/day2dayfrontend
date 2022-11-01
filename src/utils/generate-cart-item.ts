import isEmpty from "lodash/isEmpty";

interface Item {
  id: string | number;
  product_name: string;
  product_slug: string;
  product_thumbnail: {
    thumbnail: string;
    [key: string]: unknown;
  };
  purchase_price: number;
  selling_price?: number;
  [key: string]: unknown;
}
export function generateCartItem(item: Item, attributes: object) {
  const {
    id,
    product_name,
    product_slug,
    product_thumbnail,
    purchase_price,
    selling_price,
  } = item;
  console.log(item, "item");
  return {
    id: !isEmpty(attributes)
      ? `${id}.${Object.values(attributes).join(".")}`
      : id,
    product_name,
    product_slug,
    image: product_thumbnail,
    price: selling_price ? selling_price : purchase_price,
    attributes,
  };
}
