import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import { useLoginMutation, LoginInputType } from "@framework/auth/use-login";
import { useUI } from "@contexts/ui.context";
import Logo from "@components/ui/logo";
import { ImGoogle2, ImFacebook2 } from "react-icons/im";
import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
// import { gapi } from "gapi-script";
import { SignUpInputType, useSignUpMutation } from "@framework/auth/use-signup";

const LoginForm: React.FC = () => {
  let gpi: {
    client: { init: (arg0: { clientId: string; scope: string }) => void };
    load: (arg0: string, arg1: () => void) => void;
  };
  const { t } = useTranslation();
  const { setModalView, openModal, closeModal, setRememberMe, rememberMe } =
    useUI();

  const { mutate: signUp } = useSignUpMutation();

  const { mutate: login, isLoading } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputType>();

  async function onSubmit({ email, password, remember_me }: LoginInputType) {
    try {
      const res = await login({
        email,
        password,
        remember_me,
      });
      console.log(res);
      console.log("login response");
    } catch (err) {
      console.log("login errr");
      console.log(err);
    }
  }
  function handelSocialLogin() {
    login({
      email: "demo@demo.com",
      password: "demo",
      remember_me: true,
    });
  }
  function handleSignUp() {
    setModalView("SIGN_UP_VIEW");
    return openModal();
  }
  function handleForgetPassword() {
    setModalView("FORGET_PASSWORD");
    return openModal();
  }
  useEffect(() => {
    // Your code here
    setRememberMe(false);
  }, []);

  const clientId =
    "764934816914-i9k3l79um38itcd6bfihi43hh6pi5usb.apps.googleusercontent.com";

  useEffect(() => {
    importModule();
  }, []);

  const importModule = async () => {
    gpi = await import("gapi-script").then((pack) => pack.gapi);

    const initClient = () => {
      gpi.client.init({
        clientId: clientId,
        scope: "",
      });
    };

    gpi.load("client:auth2", initClient);
  };

  const onSuccess = (res: any, {}: SignUpInputType) => {
    signUp({
      name: res?.profileObj?.name,
      email: res?.profileObj?.email,
      username: res?.profileObj?.givenName,
      password: "12345678",
    });
  };

  const onFailure = (err: any) => {};

  const handleResetPassword = () => {
    closeModal();
  };

  return (
    <div className="overflow-hidden bg-gray-750 mx-auto rounded-lg w-full sm:w-96 md:w-450px  py-5 px-5 sm:px-8">
      <div className="text-center mb-6 pt-2.5">
        <div onClick={closeModal}>
          <Logo />
        </div>
        <p className="text-sm md:text-base text-white mt-2 mb-8 sm:mb-10">
          {t("common:login-helper")}
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center"
        noValidate
      >
        <div className="flex flex-col space-y-3.5">
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
            id="email-id-login"
            errorKey={errors.email?.message}
          />
          <PasswordInput
            labelKey="forms:label-password"
            errorKey={errors.password?.message}
            {...register("password", {
              required: `${t("forms:password-required")}`,
            })}
          />
          <div className="flex items-center justify-center">
            <div className="flex items-center flex-shrink-0">
              <label className="switch relative inline-block w-10 cursor-pointer">
                <input
                  id="remember"
                  type="checkbox"
                  onChange={() => {
                    setRememberMe(!rememberMe);
                  }}
                  className="opacity-0 w-0 h-0"
                />
                <span
                  className={
                    rememberMe
                      ? "bg-gradient-to-r from-orange-500  to-pink-500 absolute inset-0 transition-all duration-300 ease-in slider round"
                      : "bg-gray-500 absolute inset-0 transition-all duration-300 ease-in slider round"
                  }
                ></span>
              </label>
              <label
                htmlFor="remember"
                className="flex-shrink-0 text-sm text-heading ps-3 cursor-pointer"
              >
                {t("forms:label-remember-me")}
              </label>
            </div>
            <div className="flex ms-auto">
              {/* <button
                type="button"
                onClick={handleForgetPassword}
                className="text-end text-sm text-heading ps-3 underline hover:no-underline focus:outline-none"
              >
                {t("common:text-forgot-password")}
              </button> */}
            </div>
          </div>
          <div className="relative">
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="h-11 md:h-12 w-full mt-1.5 bg-gradient-to-r from-orange-500  to-pink-500"
            >
              {t("common:text-login")}
            </Button>
          </div>
        </div>
      </form>
      <div className="flex flex-col items-center justify-center relative text-sm text-black mt-6 mb-3.5">
        <hr className="w-full border-gray-600" />
        {/* <span className="absolute -top-2.5 px-2 bg-white">
					{t("common:text-or")}
				</span> */}
      </div>
      <GoogleLogin
        className="h-11 md:h-12 mt-2.5 text-center w-full google-text-button"
        clientId={clientId}
        buttonText="Sign in with Google" //@ts-ignore
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
        style={{ backgroundColor: "black", textAlign: "center" }}
      />
      <Button
        loading={isLoading}
        disabled={isLoading}
        className="h-11 md:h-12 w-full mt-2.5 bg-facebookHover hover:bg-facebookHover/80 facebook-color "
        onClick={handelSocialLogin}
      >
        <ImFacebook2 className="text-sm sm:text-base me-1.5" />
        {t("common:text-login-with-facebook")}
      </Button>
      {/* <Button
        loading={isLoading}
        disabled={isLoading}
        className="h-11 md:h-12 w-full mt-2.5 bg-google hover:bg-googleHover"
        onClick={handelSocialLogin}
      >
        <ImGoogle2 className="text-sm sm:text-base me-1.5" />
        {t("common:text-login-with-google")}
      </Button> */}
      <div className="w-full flex flex-col">
        <div className="text-sm sm:text-base text-white text-center mt-5 mb-1">
          {t("common:text-no-account")}{" "}
          <button
            type="button"
            className="text-sm sm:text-base underline font-bold hover:no-underline focus:outline-none ml-2  text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-orange-800 "
            onClick={handleSignUp}
          >
            {t("common:text-register")}
          </button>
        </div>
        <div className="text-sm sm:text-base text-white text-center mt-5 mb-1">
          Forget your password?{" "}
          <button
            type="button"
            className="text-sm sm:text-base  font-bold hover:no-underline focus:outline-none ml-2 text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-orange-800"
            onClick={handleForgetPassword}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
