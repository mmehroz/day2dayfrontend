//@ts-nocheck
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import { useSignUpMutation, SignUpInputType } from "@framework/auth/use-signup";
import { ImGoogle2, ImFacebook2 } from "react-icons/im";
import Link from "@components/ui/link";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { colorsContext } from "@contexts/colors.context";

const SignUpForm: React.FC = () => {
  const { t } = useTranslation();
  const { mutate: signUp, isLoading } = useSignUpMutation();
  const { setModalView, openModal, closeModal } = useUI();
  const { theme } = useContext(colorsContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputType>();

  function handleSignIn() {
    setModalView("SIGN_UP_VIEW");
    return openModal();
  }

  function onSubmit({ name, email, username, password }: SignUpInputType) {
    signUp({
      name,
      email,
      username,
      password,
    });
  }
  return (
    <div
      style={{
        backgroundColor: theme.backgroundColor,
      }}
      className="py-5 px-5 sm:px-8 mx-auto rounded-lg w-full sm:w-96 md:w-450px"
    >
      <div className="text-center mb-6 pt-2.5">
        <div onClick={closeModal}>
          <Logo />
        </div>
        <p className="text-sm md:text-base mt-2 mb-8 sm:mb-10">
          {t("common:registration-helper")}{" "}
          <Link
            href={ROUTES.TERMS}
            className=" underline hover:no-underline focus:outline-none"
          >
            {t("common:text-terms")}
          </Link>{" "}
          &amp;{" "}
          <Link
            href={ROUTES.POLICY}
            className="underline hover:no-underline focus:outline-none"
          >
            {t("common:text-policy")}
          </Link>
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center"
        noValidate
      >
        <div className="flex flex-col space-y-4">
          <Input
            labelKey="forms:label-name"
            type="text"
            variant="solid"
            {...register("name", {
              required: "forms:name-required",
            })}
            errorKey={errors.name?.message}
          />
          <Input
            labelKey="forms:label-email"
            type="email"
            variant="solid"
            {...register("email", {
              required: `${t("forms:email-required")}`,
              pattern: {
                value:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: t("forms:email-error"),
              },
            })}
            errorKey={errors.email?.message}
            id="email-id-register"
          />
          <Input
            labelKey="forms:label-username"
            type="text"
            variant="solid"
            {...register("username", {
              required: "forms:username-required",
            })}
            errorKey={errors.username?.message}
          />
          <PasswordInput
            labelKey="forms:label-password"
            errorKey={errors.password?.message}
            {...register("password", {
              required: `${t("forms:password-required")}`,
            })}
          />
          <div className="relative">
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="h-11 md:h-12 w-full mt-2 bg-gradient-to-tr from-orange-500 to-orange-800"
            >
              {t("common:text-register")}
            </Button>
          </div>
        </div>
      </form>
      <div className="flex flex-col items-center justify-center relative text-sm mt-6 mb-3.5">
        <hr
          style={{
            borderColor: theme.borderColor,
          }}
          className="w-full "
        />
        <span
          style={{
            backgroundColor: theme.backgroundColorSecondary,
            color: theme.textColor,
          }}
          className="absolute -top-2.5 px-2 bg-gray-800 rounded-md"
        >
          OR
        </span>
      </div>

      <Button
        type="submit"
        // loading={isLoading}
        disabled={isLoading}
        className="h-11 md:h-12 w-full mt-2.5 facebook-color"
      >
        <ImFacebook2 className="text-sm sm:text-base me-1.5" />
        {t("common:text-login-with-facebook")}
      </Button>
      <Button
        type="submit"
        // loading={isLoading}
        disabled={isLoading}
        className="h-11 md:h-12 w-full mt-2.5 "
      >
        <ImGoogle2 className="text-sm sm:text-base me-1.5" />
        {t("common:text-login-with-google")}
      </Button>
      <div className="text-sm sm:text-base text-white text-center mt-5 mb-1">
        {t("common:text-have-account")}{" "}
        <button
          type="button"
          className="text-sm sm:text-base underline font-bold hover:no-underline focus:outline-none text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-orange-800"
          onClick={handleSignIn}
        >
          {t("common:text-login")}
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;
