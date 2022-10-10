import { NextSeo } from "next-seo";
import Header from "@components/layout/header/header";
import Footer from "@components/layout/footer/footer";
import MobileNavigation from "@components/layout/mobile-navigation/mobile-navigation";
import Search from "@components/common/search";
import CookieBar from "@components/common/cookie-bar";
import { useAcceptCookies } from "@utils/use-accept-cookies";
import Button from "@components/ui/button";
import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Layout: React.FC = ({ children }) => {
  const [isAdult, setIsAdult] = useState(false);
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies();
  const { t } = useTranslation("common");
  const router = useRouter();

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

  const handleAgree = () => {
    const obj = { isAdult: true };
    localStorage.setItem("isAdult", JSON.stringify(obj));
    setIsAdult(true);
  };

  const handleDisagree = () => {
    router?.replace("https://www.google.com/");
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
      <Header />
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
        <div className="w-[100rem] h-[100rem] bg-black/60  absolute z-[999999] overflow-x-hidden">
          <div
            id="modal-verify"
            className="fixed w-[25rem] h-[15rem] bg-gray-800 rounded-xl  top-[40%] bottom-0 left-[35%] right-0 flex flex-col py-10 items-center custom-shadow"
          >
            <h2 className="text-white text-[1.8rem] font-semibold text-orange-500">
              Age Verification
            </h2>
            <h2 className="font-semibold mt-5">
              Are you atleast 21 years old?
            </h2>
            <div className="w-full mt-6 flex gap-4 px-10">
              <button
                onClick={handleAgree}
                className="font-semibold rounded-md bg-gradient-to-tr to-orange-500 from-pink-500 px-10 py-4 text-white hover:opacity-80 duration-300 transition"
              >
                Yes
              </button>
              <button
                onClick={handleDisagree}
                className="font-semibold rounded-md bg-gradient-to-tr to-red-500 from-pink-500 px-10 py-4 text-white hover:opacity-80 duration-300 transition"
              >
                Disagree & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
