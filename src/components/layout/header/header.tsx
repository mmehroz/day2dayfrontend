//@ts-nocheck
import React, { useRef, useContext } from "react";
import SearchIcon from "@components/icons/search-icon";
import { siteSettings } from "@settings/site-settings";
import HeaderMenu from "@components/layout/header/header-menu";
import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import { ROUTES } from "@utils/routes";
import { addActiveScroll } from "@utils/add-active-scroll";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import LanguageSwitcher from "@components/ui/language-switcher";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import Cookies from "js-cookie";
import { userContext } from "@contexts/user.context";
import { colorsContext } from "@contexts/colors.context";
import { IoCloudyNight } from "react-icons/io5";
import { MdNightsStay } from "react-icons/md";
import { useWindowSize } from "@utils/use-window-size";

const AuthMenu = dynamic(() => import("./auth-menu"), { ssr: false });
const CartButton = dynamic(() => import("@components/cart/cart-button"), {
  ssr: false,
});

type DivElementRef = React.MutableRefObject<HTMLDivElement>;

const { site_header } = siteSettings;
const Header: React.FC = () => {
  const {
    openSidebar,
    setDrawerView,
    openSearch,
    openModal,
    setModalView,
    isAuthorized,
  } = useUI();
  const { t } = useTranslation("common");
  const siteHeaderRef = useRef() as DivElementRef;
  addActiveScroll(siteHeaderRef);
  const { name } = useContext(userContext);
  const { width } = useWindowSize();
  const { theme, setNightMode, darkTheme, setLightMode } =
    useContext(colorsContext);
  function handleLogin() {
    setModalView("LOGIN_VIEW");
    return openModal();
  }
  function handleMobileMenu() {
    setDrawerView("MOBILE_MENU");
    return openSidebar();
  }

  return (
    <header
      id="siteHeader"
      ref={siteHeaderRef}
      className="w-full h-16 sm:h-20 lg:h-24 relative z-20"
    >
      <div className="text-white bg-gradient-to-r from-orange-500  to-pink-500 w-full my-0 fixed top-0 text-center py-2">
        <div className="marquee">
          <div className={` ${width > 400 ? "" : "track" } `}>
            <div className="content">
              &nbsp;WARNING! Some products contains nicotine. Nicotine is an
              addictive chemical
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          color: theme.textColor,
          backgroundColor: theme.backgroundColorSecondary,
        }}
        className="innerSticky mt-8  body-font fixed w-full h-16 sm:h-20 lg:h-15 z-20 ps-4 md:ps-0 lg:ps-6 pe-4 lg:pe-6 transition duration-200 ease-in-out"
      >
        <div className="flex items-center justify-center mx-auto max-w-[1920px] h-full w-full">
          <button
            aria-label="Menu"
            className="menuBtn hidden md:flex lg:hidden flex-col items-center justify-center px-5 2xl:px-7 flex-shrink-0 h-full outline-none focus:outline-none"
            onClick={handleMobileMenu}
          >
            <span className="menuIcon">
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </span>
          </button>
          <Logo />
          <HeaderMenu
            data={site_header.menu}
            className="hidden lg:flex md:ms-6 xl:ms-10"  />

          <div className="flex-shrink-0 ms-auto lg:me-5 xl:me-8 2xl:me-10">
            {darkTheme ? (
              <MdNightsStay
                onClick={setLightMode}
                size={22}
                className="text-orange-500 cursor-pointer"
              />
            ) : (
              <IoCloudyNight
                onClick={setNightMode}
                size={22}
                className="text-orange-500 cursor-pointer"
              />
            )}
          </div>
          <div className="hidden md:flex justify-end items-center space-s-6 lg:space-s-5 xl:space-s-8 2xl:space-s-10 ms-auto flex-shrink-0">
            <button
              className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none transform"
              onClick={openSearch}
              aria-label="search-button"
            >
              <SearchIcon />
            </button>
            <div className="-mt-0.5 flex-shrink-0">
              <AuthMenu
                isAuthorized={isAuthorized}
                href={ROUTES.ACCOUNT}
                className="text-sm xl:text-base  font-semibold"
                btnProps={{
                  className:
                    "text-sm xl:text-base font-semibold focus:outline-none",
                  children: t("text-sign-in"),
                  onClick: handleLogin,
                }}
              >
                {name ?? "Account"}
              </AuthMenu>
            </div>
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
