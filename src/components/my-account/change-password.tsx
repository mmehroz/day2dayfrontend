import PasswordInput from "@components/ui/password-input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { fadeInTop } from "@utils/motion/fade-in-top";
import {
  useChangePasswordMutation,
  ChangePasswordInputType,
} from "@framework/customer/use-change-password";
import { useTranslation } from "next-i18next";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useState } from "react";
const defaultValues = {
  oldPassword: "",
  newPassword: "",
};

const ChangePassword: React.FC = () => {
  const { mutate: changePassword, isLoading } = useChangePasswordMutation();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInputType>({
    defaultValues,
  });
  async function onSubmit(input: ChangePasswordInputType) {
    try {
      setLoading(true);
      console.log("input fields: ", input);
      const user_id = Cookies.get("current_user_id");
      if (!user_id) throw new Error("Someting went wrong");
      await axios("http://207.244.250.143/day2day/api/changepassword", {
        method: "POST",
        data: {
          user_id: parseInt(user_id),
          password: input.newPassword,
          oldpassword: input.oldPassword,
        },
      });
      changePassword(input);
      toast("password updated successfull", {
        progressClassName: "fancy-progress-bar",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
    } catch (err) {
      //@ts-ignore
      toast(err?.message, {
        progressClassName: "fancy-progress-bar",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
    }
  }
  const { t } = useTranslation();
  return (
    <>
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
        {t("common:text-change-password")}
      </h2>
      <motion.div
        layout
        initial="from"
        animate="to"
        exit="from"
        //@ts-ignore
        variants={fadeInTop(0.35)}
        className={`w-full flex  h-full lg:w-8/12 flex-col`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mx-auto flex flex-col justify-center "
        >
          <div className="flex flex-col space-y-3">
            <PasswordInput
              labelKey="forms:label-old-password"
              errorKey={errors.oldPassword?.message}
              {...register("oldPassword", {
                required: "forms:password-old-required",
              })}
              className="mb-4"
            />
            <PasswordInput
              labelKey="forms:label-new-password"
              errorKey={errors.newPassword?.message}
              {...register("newPassword", {
                required: "forms:label-new-password",
              })}
              className="mb-4"
            />

            <div className="relative">
              <Button
                type="submit"
                loading={loading}
                disabled={isLoading}
                className="h-13 mt-3 bg-gradient-to-r from-orange-500  to-pink-500"
              >
                {t("common:text-change-password")}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default ChangePassword;
