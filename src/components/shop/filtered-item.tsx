import { useRouter } from "next/router";
import { IoClose } from "react-icons/io5";
import isEmpty from "lodash/isEmpty";
import { colorsContext } from "@contexts/colors.context";
import { useContext } from "react";

interface Props {
  itemKey: string;
  itemValue: string;
}

export const FilteredItem = ({ itemKey, itemValue }: Props) => {
  const router = useRouter();
  const { theme } = useContext(colorsContext);

  function handleClose() {
    router?.push("/");
  }
  return (
    <div
      style={{
        backgroundColor: theme.backgroundColorThird,
        color: theme.textColor,
      }}
      className="group flex flex-shrink-0 m-1.5 items-center   rounded-lg text-xs px-3.5 py-2.5 capitalize cursor-pointer transition duration-200 ease-in-out "
      onClick={handleClose}
    >
      {itemValue}
      <IoClose className="text-sm text-body ms-2 flex-shrink-0 -me-0.5 mt-0.5 transition duration-200 ease-in-out group-hover:text-heading" />
    </div>
  );
};
