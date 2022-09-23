import Input, { Props } from "@components/ui/input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Image from 'next/image';
import { fadeInTop } from "@utils/motion/fade-in-top";
import {
	useUpdateUserMutation,
	UpdateUserType,
} from "@framework/customer/use-update-customer";
import { RadioBox } from "@components/ui/radiobox";
import { useTranslation } from "next-i18next";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";

const myLoader = ({ src }) => {
	return `${API_ENDPOINTS.NEXT_PUBLIC_REST_ENDPOINT}/public/assets/img/${src}`;
  };

const defaultValues = {};
const AccountDetails: React.FC<Props> = ({ data }) => {
	const { mutate: updateUser, isLoading } = useUpdateUserMutation();
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateUserType>({
		defaultValues,
	});
	function onSubmit(input: UpdateUserType) {
		updateUser(input);
	}

	return (
		<motion.div
			layout
			initial="from"
			animate="to"
			exit="from"
			//@ts-ignore
			variants={fadeInTop(0.35)}
			className={`w-full flex flex-col`}
		>
			<h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
				{t("common:text-account-details")}
			</h2>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full mx-auto flex flex-col justify-center "
				noValidate
			>
				<div className="flex flex-col space-y-4 sm:space-y-5">
				{data?.map((details: any) => (
					<>
					 <div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
						<Image
							loader={myLoader}
							src={details.photo}
							width={200}
							height={200}
							quality={100}
							alt={details.username?.username}
						/>
					</div>
					<div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
						<Input
							labelKey="forms:label-first-name"
							{...register("firstName", {
								required: "forms:first-name-required",
								
							})}
							
							variant="solid"
							className="w-full sm:w-1/2"
							defaultValue={details.name}

							errorKey={errors.firstName?.message} />
						<Input
							labelKey="forms:label-last-name"
							{...register("lastName", {
								required: "forms:last-name-required",
							})}
							// defaultValue={details.last-name}
							variant="solid"
							className="w-full sm:w-1/2"
							errorKey={errors.lastName?.message} />
					</div><Input
							labelKey="forms:label-username"
							{...register("displayName", {
								required: "forms:username-required",
							})}
							defaultValue={details.username}
							variant="solid"
							errorKey={errors.displayName?.message} />
							<div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
							<Input
								type="tel"
								labelKey="forms:label-phone"
								{...register("phoneNumber", {
									required: "forms:phone-required",
								})}
							defaultValue={details.phone}
								variant="solid"
								className="w-full sm:w-1/2"
								errorKey={errors.phoneNumber?.message} />
							<Input
								type="email"
								labelKey="forms:label-email-star"
								{...register("email", {
									required: "forms:email-required",
									pattern: {
										value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
										message: "forms:email-error",
									},
								})}
							defaultValue={details.email}
								variant="solid"
								className="w-full sm:w-1/2"
								errorKey={errors.email?.message} />
						</div><div className="relative flex flex-col">
							<span className="mt-2 text-sm text-heading font-semibold block pb-1">
								{t("common:text-gender")}
							</span>
							<div className="mt-2 flex items-center space-s-6">
								<RadioBox
									labelKey="forms:label-male"
									{...register("gender")}
									value="male" />
								<RadioBox
									labelKey="forms:label-female"
									{...register("gender")}
									value="female" />
							</div>
						</div><div className="relative">
							<Button
								type="submit"
								loading={isLoading}
								disabled={isLoading}
								className="h-12 mt-3 w-full sm:w-32 bg-gradient-to-r from-orange-500  to-pink-500"
							>
								{t("common:button-submit")}
							</Button>
						</div>
						</>
				))}
				</div>
			</form>
		</motion.div>
	);
};

export default AccountDetails;
