import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { colorsContext } from "@contexts/colors.context";
import { useRouter } from "next/router";

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelKey?: string;
  label?: string | any;
}

export const CheckBox = React.forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ labelKey, label, ...rest }, ref) => {
    const router = useRouter();
    const { t } = useTranslation();
    const { theme, darkTheme } = useContext(colorsContext);
    const [values, setValues] = useState([]);

    console.log("labelKey: ", labelKey);

    useEffect(() => {
      console.log(router?.query);
      console.log("router query");


      if (router?.query?.product_sub?.toString()?.includes("+")) {
        const val = router?.query?.product_sub?.toString()?.split("+");
        setValues(val);
      }

      if (router?.query?.product_main?.toString()?.includes("+")) {
        const val = router?.query?.product_main?.toString()?.split("+");
        setValues(val);
      }
      if (router?.query?.product_inner?.toString()?.includes("+")) {
        const val = router?.query?.product_inner?.toString()?.split("+");
        setValues(val);
      }


    }, [router?.query]);

    const renderBackgrounColor = () => {
      if (!darkTheme) {
        const isChecked = values?.find(
          (el) =>
            el?.toLowerCase() === label?.toLowerCase()?.split(" ")?.join("-")
        );

        console.log(isChecked);
        console.log("ischecked");

        if (isChecked) {
          return "#f97316";
        }

        return theme.backgroundColorThird;
      }
    };

    return (
      <label
        style={{ color: theme.textColor }}
        className="group flex items-center  text-sm cursor-pointer"
      >
        <input
          style={{
            backgroundColor: renderBackgrounColor(),
            borderColor: !darkTheme && "transparent",
          }}
          type="checkbox"
          className="form-checkbox w-5 h-5 bg-gray-700 border-gray-700 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0  focus:outline-none focus:ring-0 focus-visible:outline-none checked:bg-orange-500 checked:hover:bg-pink-500 checked:focus:bg-pink-500"
          ref={ref}
          {...rest}
        />
        <span className="ms-4 -mt-0.5">{labelKey ? t(labelKey) : label}</span>
      </label>
    );
  }
);
