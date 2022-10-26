//@ts-nocheck

import cn from "classnames";
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
}

export const ProductAttributes: React.FC<Props> = ({
  className = "mb-4",
  title,
  attributes,
  active,
  onClick,
}) => {
  console.log(attributes);
  console.log("from attribute component");

  return (
    <div className={className}>
      <h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
        {title}
      </h3>
      <ul className="colors flex flex-wrap -me-3">
        {/* {attributes?.map(({ id, value, meta }) => ( */}
        {attributes?.map(({ id, size, quantity }) => (
          <li
            key={`${size}-${id}`}
            className={cn(
              "cursor-pointer rounded-md border border-gray-100  p-2 mb-2 md:mb-3 me-2 md:me-3 flex justify-center items-center text-heading text-xs md:text-sm uppercase font-semibold transition duration-200 ease-in-out hover:border-orange-500",
              {
                "border-pink-500": size === active,
              }
            )}
            onClick={() => onClick({ [title]: size })}
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
        ))}
      </ul>
    </div>
  );
};
