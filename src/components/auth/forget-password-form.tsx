import Button from "@components/ui/button";
import Input from "@components/ui/input";
import Logo from "@components/ui/logo";
import { useForm } from "react-hook-form";
import { useUI } from "@contexts/ui.context";
import { useTranslation } from "next-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

type FormValues = {
  email: string;
};

const defaultValues = {
  email: "",
};

const ForgetPasswordForm = () => {
  const { t } = useTranslation();
  const { setModalView, openModal, closeModal } = useUI();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const [loading, setLoading] = useState(false);

  function handleSignIn() {
    setModalView("LOGIN_VIEW");
    return openModal();
  }

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      console.clear();
      if (!values?.email) return;

      await axios("https://portal.day2daywholesale.com/api/forgetpassword", {
        method: "POST",
        data: {
          email: values?.email,
        },
      });

      toast(`check your email at ${values?.email}`, {
        progressClassName: "fancy-progress-bar",
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 px-5 sm:p-8 bg-gray-800 mx-auto rounded-lg w-full sm:w-96 md:w-450px ">
      <div className="text-center mb-9 pt-2.5">
        <div onClick={closeModal}>
          <Logo />
        </div>
        <p className="text-sm md:text-base text-body mt-3 sm:mt-4 mb-8 sm:mb-10">
          {t("common:forgot-password-helper")}
        </p>
      </div>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="flex flex-col justify-center"
        noValidate
      >
        <Input
          labelKey="forms:label-email"
          type="email"
          variant="solid"
          className="mb-4"
          {...register("email", {
            required: `${t("forms:email-required")}`,
            pattern: {
              value:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: t("forms:email-error"),
            },
          })}
          errorKey={errors.email?.message}
        />

        <Button
          type="submit"
          className="h-11 md:h-12 w-full mt-2 bg-gradient-to-tr to-orange-500 from-orange-800"
          loading={loading}
        >
          {t("common:text-reset-password")}
        </Button>
      </form>
      <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-10 mb-6 sm:mb-7">
        <hr className="w-full border-gray-300" />
        <span className="absolute -top-2.5 px-2 bg-gray-800">
          {t("common:text-or")}
        </span>
      </div>
      <div className="text-sm sm:text-base text-white text-center">
        {t("common:text-back-to")}{" "}
        <button
          type="button"
          className="text-sm sm:text-base  underline font-bold hover:no-underline focus:outline-none text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-orange-800 "
          onClick={handleSignIn}
        >
          {t("common:text-login")}
        </button>
      </div>
    </div>
  );
};

export default ForgetPasswordForm;
