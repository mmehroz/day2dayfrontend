import { NextSeo } from "next-seo";
import Header from "@components/layout/header/header";
import Footer from "@components/layout/footer/footer";
import MobileNavigation from "@components/layout/mobile-navigation/mobile-navigation";
import Search from "@components/common/search";
import CookieBar from "@components/common/cookie-bar";
import { useAcceptCookies } from "@utils/use-accept-cookies";
import Button from "@components/ui/button";
import { useTranslation } from "next-i18next";
import React, { useState, useEffect, ChangeEvent, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Logo from "@components/ui/logo";
import { motion, AnimatePresence } from "framer-motion";
import { userContext } from "@contexts/user.context";

const Layout: React.FC = ({ children }) => {
  const [isAdult, setIsAdult] = useState(false);
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies();
  //@ts-ignore
  const { hideHeader } = useContext(userContext);
  const { t } = useTranslation("common");
  const router = useRouter();
  const [tokenCred, setTokenCred] = useState({
    verifyToken: null,
    id: null,
  });
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("router query: ", router?.query);
    if (!router?.query?.resetPassword) return;
    toast("verfying user", {
      progressClassName: "fancy-progress-bar",
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    fetchResetCred(router?.query?.resetPassword)
      .then((res) => {
        console.log("response of a function: ", res);
        setTokenCred({
          verifyToken: res?.data?.verify_token,
          id: res?.data?.id,
        });
      })
      .catch((err) => {
        toast(err?.message, {
          progressClassName: "fancy-progress-bar",
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  }, [router?.query]);

  useEffect(() => {
    const adult = localStorage.getItem("isAdult");
    if (!adult) return;

    const obj = JSON.parse(adult);
    console.log("object is adult: ", obj);
    if (obj?.isAdult) {
      setIsAdult(true);
    }
    console.log("adult: ", adult);
  }, []);

  const handlePasswordChange =
    (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setPasswords({ ...passwords, [name]: e.target.value });
    };

  async function fetchResetCred(verify_token: any) {
    return await axios("https://portal.day2daywholesale.com/api/verifycode", {
      method: "POST",
      data: {
        verify_token,
      },
    });
  }

  const handleAgree = () => {
    const obj = { isAdult: true };
    localStorage.setItem("isAdult", JSON.stringify(obj));
    setIsAdult(true);
  };

  const handleDisagree = () => {
    router?.replace("https://www.google.com/");
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      if (!tokenCred?.verifyToken) throw new Error("Something went wrong");
      if (!passwords?.password) return;
      if (!passwords?.confirmPassword) return;

      if (passwords?.password !== passwords?.confirmPassword)
        throw new Error("Password Not Matched");

      setLoading(true);
      const res = await axios(
        "https://portal.day2daywholesale.com/api/resetpassword",
        {
          method: "POST",
          data: {
            verify_token: tokenCred?.verifyToken,
            id: tokenCred?.id,
            password: passwords?.password,
          },
        }
      );

      console.log("response of a api resetpassword: ", res);

      toast("Password Change Successfull", {
        progressClassName: "fancy-progress-bar",
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-red-500",
      });

      setPasswords({
        password: "",
        confirmPassword: "",
      });

      setTokenCred({
        verifyToken: null,
        id: null,
      });

      setTimeout(() => {
        router?.push("/");
      }, 5000);

      setLoading(false);
    } catch (err) {
      console.log(err);
      //@ts-ignore
      toast(err?.message, {
        progressClassName: "fancy-progress-bar",
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-red-500",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NextSeo
        additionalMetaTags={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        ]}
        title="DAY 2 DAY WHOLESALE"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        canonical="/"
        openGraph={{
          url: "/",
          title: "DAY 2 DAY WHOLESALE",
          description: "DAY 2 DAY WHOLESALE",
          images: [
            {
              url: "/assets/images/og-image-01.png",
              width: 800,
              height: 600,
              alt: "Og Image Alt",
            },
            {
              url: "/assets/images/og-image-02.png",
              width: 900,
              height: 800,
              alt: "Og Image Alt Second",
            },
          ],
        }}
      />
      {hideHeader ? null : <Header />}
      <main
        className="relative flex-grow"
        style={{
          minHeight: "-webkit-fill-available",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </main>
      <Footer />
      <MobileNavigation />
      <Search />
      <CookieBar
        title={t("text-cookies-title")}
        className={"bg-gray-750"}
        hide={acceptedCookies}
        action={
          <Button
            onClick={() => onAcceptCookies()}
            variant="slim"
            className="bg-gradient-to-r from-orange-500  to-pink-500"
          >
            {t("text-accept-cookies")}
          </Button>
        }
      />
      {!isAdult && (
        <div className="w-screen h-screen bg-black/60  absolute z-[999999] overflow-x-hidden flex items-center justify-center p-10 md:p-0  ">
          <div
            id="modal-verify"
            className="md:absolute w-[25rem] h-[15rem] bg-gray-800 rounded-xl  top-[40%] bottom-0 left-[40%] right-0 flex flex-col py-10 items-center custom-shadow"
          >
            <h2 className=" text-[1.8rem] font-semibold text-orange-500">
              Age Verification
            </h2>
            <h2 className="font-semibold mt-5">
              Are you atleast 21 years old?
            </h2>
            <div className="w-full md:mt-6 mt-10 flex gap-4 px-10 items-center justify-center">
              <button
                onClick={handleAgree}
                className="font-semibold rounded-md bg-gradient-to-tr to-orange-500 from-pink-500 px-10 md:py-4 text-white hover:opacity-80 duration-300 transition text-sm md:text-base py-3"
              >
                Yes
              </button>
              <button
                onClick={handleDisagree}
                className="font-semibold rounded-md bg-gradient-to-tr to-red-500 from-pink-500 px-10 md:py-4 text-white hover:opacity-80 duration-300 transition text-sm md:text-base py-3"
              >
                Disagree
              </button>
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {tokenCred?.id && (
          <motion.div
            initial={{ y: "25%" }}
            animate={{ y: "-14%" }}
            exit={{ y: "25%" }}
            className="w-[100rem] h-[100rem]  z-[999999] overflow-x-hidden fixed"
          >
            <div className="fixed w-[25rem] h-[25rem] bg-gray-800 rounded-xl  top-[25%] bottom-0 left-[35%] right-0 flex flex-col py-10 items-center custom-shadow">
              <Logo />
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-4 px-10"
              >
                <input
                  className="w-full p-4 rounded-md bg-gray-700 outline-none text-white mt-4"
                  placeholder="New Password"
                  onChange={handlePasswordChange("password")}
                  required
                  type="password"
                />
                <input
                  className="w-full p-4 rounded-md bg-gray-700 outline-none text-white "
                  placeholder="Confirm Password"
                  onChange={handlePasswordChange("confirmPassword")}
                  required
                  type="password"
                />

                <button
                  onClick={handleSubmit}
                  type="submit"
                  disabled={loading}
                  className="outline-none p-4 w-full  bg-gradient-to-tr to-orange-500 from-pink-500 text-white rounded-md"
                >
                  Submit
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
