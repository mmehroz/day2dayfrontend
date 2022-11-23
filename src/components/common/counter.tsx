//@ts-nocheck
import MinusIcon from "@components/icons/minus-icon";
import PlusIcon from "@components/icons/plus-icon";
import { colorsContext } from "@contexts/colors.context";
import cn from "classnames";
import { useContext } from "react";
type CounterProps = {
  quantity: number;
  onDecrement: (e: any) => void;
  onIncrement: (e: any) => void;
  disableIncrement?: boolean;
  disableDecrement?: boolean;
  variant?: "default" | "dark";
  className?: string;
};
const Counter: React.FC<CounterProps> = ({
  quantity,
  onDecrement,
  onIncrement,
  disableIncrement = false,
  disableDecrement = false,
  variant = "default",
}) => {
  const size = variant !== "dark" ? "12px" : "10px";
  const { theme, darkTheme } = useContext(colorsContext);
  return (
    <div
      style={{
        color: theme.textColor,
        borderColor: theme.borderColor,
        backgroundColor: darkTheme
          ? theme.backgroundColor
          : theme.backgroundColorThird,
      }}
      className={cn(
        "group flex items-center justify-between rounded-md overflow-hidden flex-shrink-0",
        {
          "border h-11 md:h-12 ": variant === "default",
          "h-8 md:h-9 shadow-navigation ": variant === "dark",
        }
      )}
    >
      <button
        onClick={onDecrement}
        style={{
          color: theme.textColor,
          borderColor: theme.borderColor,
          backgroundColor: darkTheme
            ? theme.backgroundColor
            : theme.backgroundColorThird,
        }}
        className={cn(
          "flex items-center justify-center flex-shrink-0 h-full transition ease-in-out duration-300 focus:outline-none",
          {
            "w-10 md:w-12  border-e   hover:text-gray-800 hover:bg-gray-500":
              variant === "default",
            "w-8 md:w-9    border-e border-gray-690 focus:outline-none":
              variant === "dark",
          }
        )}
        disabled={disableDecrement}
      >
        <MinusIcon width={size} />
      </button>

      <span
        className={cn(
          "font-semibold  flex items-center justify-center h-full  transition-colors duration-250 ease-in-out cursor-default flex-shrink-0",
          {
            "text-base  w-12  md:w-20 xl:w-24": variant === "default",
            "text-sm   w-8 md:w-10 ": variant === "dark",
          }
        )}
      >
        {quantity}
      </span>

      <button
        style={{
          borderColor: theme.borderColor,
          backgroundColor: darkTheme
            ? theme.backgroundColor
            : theme.backgroundColorThird,
        }}
        onClick={onIncrement}
        className={cn(
          "flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none",
          {
            "w-10 md:w-12  border-s   hover:text-gray-800 hover:bg-gray-500":
              variant === "default",
            "w-8 md:w-9    border-s border-gray-690 focus:outline-none":
              variant === "dark",
          }
        )}
        disabled={disableIncrement}
      >
        <PlusIcon width={size} height={size} />
      </button>
    </div>
  );
};
export default Counter;
