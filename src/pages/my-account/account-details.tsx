import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import AccountDetails from "@components/my-account/account-details";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function AccountDetailsPage() {
  const [details, setDetails] = useState([]);

  const getDetails = () => {
    return http
      .get(API_ENDPOINTS.ACCOUNT_DETAILS, {
        headers: { Authorization: `Bearer ${Cookies.get("auth_token")}` },
      })
      .then((response) => {
        // (response, 'data');
        // setDetails(response.data);

        let detail = [];

        detail.push(response.data);

        setDetails(detail);
      })
      .catch((err) => {
        setDetails(null);
      });
  };
  useEffect(() => {
    getDetails();
  }, []);

  return (
    <AccountLayout>
      <AccountDetails data={details} />
    </AccountLayout>
  );
}

AccountDetailsPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};
