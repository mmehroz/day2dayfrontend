//@ts-nocheck

import { colorsContext } from "@contexts/colors.context";
import cn from "classnames";
import { useContext } from "react";
interface Props {
  className?: string;
  title: string;
  attributes: {
    id: number;
    value: string;
    meta: string;
  }[];
  active: string;
  onClick: any;
  data: any;
  handleVariant: any;
}

export const ProductAttributes: React.FC<Props> = ({
  className = "mb-4",
  title,
  attributes,
  active,
  onClick,
  data,
  handleVariant,
}) => {
  const { theme } = useContext(colorsContext);
  console.log("attributes: ", attributes);
  return (
    <div className={className}>
      <h3 className="text-base md:text-lg  font-semibold mb-2.5 capitalize">
        {title}
      </h3>
      <ul className="colors flex flex-wrap -me-3 items-center">
        {/* {attributes?.map(({ id, value, meta }) => ( */}
        {attributes?.map(({ id, size, quantity, variantprice, variantimage }) => {
          if (title?.toLowerCase()?.includes("colors")) {
            return (
              <li
                style={{
                  borderColor: size === active ? "#f97316" : theme.borderColor,
                  backgroundColor: size,
                }}
                key={`${size}-${id}`}
                className={`w-4 h-4 rounded-full cursor-pointer mr-2 ${size === active && "w-6 h-6"}`}
                onClick={() => {
                  handleVariant({ variantprice, quantity, variantimage });
                  onClick({ [title]: size });
                }}
              ></li>
            );
          }

          return (
            <li
              style={{
                borderColor: size === active ? "#f97316" : theme.borderColor,
              }}
              key={`${size}-${id}`}
              className={cn(
                "cursor-pointer rounded-md border  p-2 mb-2 md:mb-3 me-2 md:me-3 flex justify-center items-center text- text-xs md:text-sm uppercase font-semibold transition duration-200 ease-in-out hover:border-orange-500",
                {
                  "border-pink-500": size === active,
                }
              )}
              onClick={() => {
                handleVariant({ variantprice, quantity, variantimage });
                onClick({ [title]: size });
              }}
            >
              {title === "color" ? (
                <span
                  className="h-full w-full rounded block"
                  style={{ backgroundColor: meta }}
                />
              ) : (
                size
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
