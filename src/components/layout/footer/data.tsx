import {
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoYoutube,
} from "react-icons/io5";

export const footer = {
  widgets: [
    {
      id: 1,
      widgetTitle: "widget-title-social",
      lists: [
        {
          id: 1,
          title: "link-instagram",
          path: "https://www.instagram.com/",
          icon: <IoLogoInstagram />,
        },
        {
          id: 2,
          title: "link-twitter",
          path: "https://twitter.com/",
          icon: <IoLogoTwitter />,
        },
        {
          id: 3,
          title: "link-facebook",
          path: "https://www.facebook.com/",
          icon: <IoLogoFacebook />,
        },
        {
          id: 4,
          title: "link-youtube",
          path: "https://www.youtube.com/",
          icon: <IoLogoYoutube />,
        },
      ],
    },
    {
      id: 2,
      widgetTitle: "widget-title-contact",
      lists: [
        {
          id: 1,
          title: "link-contact-us",
          path: "/contact-us",
        },
        {
          id: 2,
          title: "link-email",
          path: "/",
        },
        {
          id: 3,
          title: "link-email-two",
          path: "/",
        },
        {
          id: 4,
          title: "link-phone",
          path: "/",
        },
      ],
    },
    {
      id: 3,
      widgetTitle: "widget-title-about",
      lists: [
        {
          id: 1,
          title: "link-support-center",
          path: "/contact-us",
        },
        {
          id: 2,
          title: "link-customer-support",
          path: "/",
        },
        {
          id: 3,
          title: "link-about-us",
          path: "/contact-us",
        },
        {
          id: 4,
          title: "link-copyright",
          path: "/",
        },
      ],
    },
    {
      id: 4,
      widgetTitle: "widget-title-customer-care",
      lists: [
        {
          id: 1,
          title: "link-faq",
          path: "/faq",
        },
        {
          id: 2,
          title: "link-shipping",
          path: "/",
        },
        {
          id: 3,
          title: "link-exchanges",
          path: "/",
        },
      ],
    },
    {
      id: 5,
      widgetTitle: "widget-title-our-information",
      lists: [
        {
          id: 1,
          title: "link-privacy",
          path: "/privacy",
        },
        {
          id: 2,
          title: "link-terms",
          path: "/terms",
        },
        {
          id: 3,
          title: "link-return-policy",
          path: "/privacy",
        },
        {
          id: 4,
          title: "link-site-map",
          path: "/",
        },
      ],
    },
  ],
  payment: [
    {
      id: 1,
      path: "/",
      image: "/assets/images/payment/mastercard.svg",
      name: "payment-master-card",
      width: 34,
      height: 20,
    },
    {
      id: 2,
      path: "/",
      image: "/assets/images/payment/visa.svg",
      name: "payment-visa",
      width: 50,
      height: 20,
    },
    {
      id: 3,
      path: "/",
      image: "/assets/images/payment/paypal.svg",
      name: "payment-paypal",
      width: 76,
      height: 20,
    },
    {
      id: 4,
      path: "/",
      image: "/assets/images/payment/amx-2.png",
      name: "american-express",
      width: 70,
      height: 20,
    },
    {
      id: 5,
      path: "/",
      image: "/assets/images/payment/discover.png",
      name: "Discover",
      width: 70,
      height: 20,
    },
  ],
};
