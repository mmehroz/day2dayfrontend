//@ts-nocheck
import { useEffect, useState } from "react";
import Input, { Props } from "@components/ui/input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Image from "next/image";
import { fadeInTop } from "@utils/motion/fade-in-top";
import {
  useUpdateUserMutation,
  UpdateUserType,
} from "@framework/customer/use-update-customer";
import { RadioBox } from "@components/ui/radiobox";
import { useTranslation } from "next-i18next";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { toast } from "react-toastify";

const myLoader = ({ src }) => {
  return `${API_ENDPOINTS.NEXT_PUBLIC_REST_ENDPOINT}/assets/img/${src}`;
};

const defaultValues = {};
const AccountDetails: React.FC<Props> = ({ data }) => {
  const { mutate: updateUser, isLoading } = useUpdateUserMutation();
  const [accountDetails, setAccountDetails] = useState(null);

  useEffect(() => {
    const accDetailsRaw = localStorage.getItem("account-details");
    if (!accDetailsRaw) return;
    const accDetails = JSON.parse(accDetailsRaw);
    console.log(accDetails);
    setAccountDetails(accDetails);
    updateUser(accDetails);
  }, []);

  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserType>({
    defaultValues,
  });
  function onSubmit(input: UpdateUserType) {
    console.log(input);
    console.log("input ");

    localStorage.setItem("account-details", JSON.stringify(input));
    toast("Details updated", {
      progressClassName: "fancy-progress-bar",
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading xl:mb-8">
        {t("common:text-account-details")}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-center"
        noValidate
      >
        <div className="flex flex-col space-y-4 sm:space-y-5">
          {data?.map((details: any) => (
            <>
              <div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
                <Input
                  labelKey="forms:label-first-name"
                  {...register("firstName", {
                    required: "forms:first-name-required",
                  })}
                  variant="solid"
                  className="w-full sm:w-1/2"
                  defaultValue={accountDetails?.firstName}
                  errorKey={errors.firstName?.message}
                />
                <Input
                  labelKey="forms:label-last-name"
                  {...register("lastName", {
                    required: "forms:last-name-required",
                  })}
                  defaultValue={accountDetails?.lastName}
                  variant="solid"
                  className="w-full sm:w-1/2"
                  errorKey={errors.lastName?.message}
                />
              </div>
              <Input
                labelKey="forms:label-address"
                {...register("address", {
                  required: "forms:address-required",
                })}
                defaultValue={accountDetails?.address}
                variant="solid"
                errorKey={errors.address?.message}
              />
              <div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
                <Input
                  type="tel"
                  labelKey="forms:label-phone"
                  {...register("phoneNumber", {
                    required: "forms:phone-required",
                  })}
                  defaultValue={accountDetails?.phoneNumber}
                  variant="solid"
                  className="w-full sm:w-1/2"
                  errorKey={errors.phoneNumber?.message}
                />
                <Input
                  type="email"
                  labelKey="forms:label-email-star"
                  {...register("email", {
                    required: "forms:email-required",
                    pattern: {
                      value:
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "forms:email-error",
                    },
                  })}
                  defaultValue={details?.email}
                  variant="solid"
                  className="w-full sm:w-1/2"
                  errorKey={errors.email?.message}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
                <Input
                  labelKey="forms:label-city"
                  {...register("city", {})}
                  defaultValue={accountDetails?.city}
                  variant="solid"
                  className="w-full sm:w-1/2"
                />
                <Input
                  labelKey="forms:label-postcode"
                  {...register("postcode", {})}
                  defaultValue={accountDetails?.postcode}
                  variant="solid"
                  className="w-full sm:w-1/2"
                />
              </div>

              <div className="relative">
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
