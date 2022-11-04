import cn from "classnames";
import React, { InputHTMLAttributes, useState, useContext } from "react";
import { Eye } from "@components/icons/eye-icon";
import { EyeOff } from "@components/icons/eye-off-icon";
import { useTranslation } from "next-i18next";
import { colorsContext } from "@contexts/colors.context";

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  inputClassName?: string;
  labelKey: string;
  name: string;
  shadow?: boolean;
  errorKey: string | undefined;
}
const classes = {
  root: "py-2 px-4 md:px-5 w-full appearance-none transition duration-150 ease-in-out border border-gray-500 text-input text-xs lg:text-sm font-body rounded-md placeholder-gray-600  transition duration-200 ease-in-out bg-white border border-gray-100 focus:outline-none focus:border-heading h-11 md:h-12",
};
const PasswordInput = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className = "block",
      inputClassName,
      labelKey,
      name,
      errorKey,
      shadow = false,
      ...rest
    },
    ref
  ) => {
    const [show, setShow] = useState(false);
    const { theme } = useContext(colorsContext);

    const rootClassName = cn(classes.root, inputClassName);
    const { t } = useTranslation();
    return (
      <div className={className}>
        {labelKey && (
          <label
            style={{
              color: theme.textColor,
            }}
            htmlFor={name}
            className="block font-semibold text-sm leading-none mb-3 cursor-pointer"
          >
            {t(labelKey)}
          </label>
        )}
        <div className="relative">
          <input
            style={{
              color: theme.textColor,
              backgroundColor: theme.backgroundColorThird,
            }}
            id={name}
            name={name}
            type={show ? "text" : "password"}
            ref={ref}
            className={rootClassName}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            {...rest}
          />
          <label
            htmlFor={name}
            className="absolute end-4 top-5 -mt-2 cursor-pointer"
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? (
              <EyeOff className="w-6 h-6" />
            ) : (
              <Eye className="w-6 h-6" />
            )}
          </label>
        </div>
        {errorKey && <p className="my-2 text-xs text-red-500">{t(errorKey)}</p>}
      </div>
    );
  }
);

export default PasswordInput;
