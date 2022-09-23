import React from "react";
import { useTranslation } from "next-i18next";
interface RadioBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
	labelKey: string | React.ReactElement;
}
export const RadioBox = React.forwardRef<HTMLInputElement, RadioBoxProps>(
	({ labelKey, ...rest }, ref) => {
		const { t } = useTranslation("forms");
		return (
			<label className="group flex items-center text-heading text-sm cursor-pointer">
				<input
					type="radio"
					className="form-radio w-5 h-5 bg-gray-700 border-gray-700 text-heading rounded-full cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-gray-700 focus:outline-none focus:ring-0 focus-visible:outline-none hover:checked:bg-pink-500 checked:bg-orange-500"
					ref={ref}
					{...rest}
				/>
				<span className="ms-2 text-sm text-heading relative">
					{t(`${labelKey}`)}
				</span>
			</label>
		);
	}
);
