import { colorsContext } from "@contexts/colors.context";
import { useContext } from "react";

type FooterItemProps = {
  id: string;
  product_name: string;
  price: string;
};
export const CheckoutCardFooterItem: React.FC<{ item: FooterItemProps }> = ({
  item,
}) => {
  const { theme } = useContext(colorsContext);
  return (
    <div
      style={{
        borderColor: theme.borderColor,
        color: theme.textColor,
      }}
      className="flex items-center py-4 lg:py-5 border-b  text-sm lg:px-3 w-full font-semibold last:border-b-0 last:text-base last:pb-0"
    >
      {item.product_name}
      <span className="ms-auto flex-shrink-0">{item.price}</span>
    </div>
  );
};
