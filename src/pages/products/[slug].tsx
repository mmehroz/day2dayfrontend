import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import ProductSingleDetails from "@components/product/product-single-details";
import RelatedProducts from "@containers/related-products";
import Divider from "@components/ui/divider";
import Breadcrumb from "@components/common/breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { useContext } from "react";
import { userContext } from "@contexts/user.context";

export default function ProductPage() {
  const { hideHeader } = useContext(userContext);
  return (
    <>
      <Divider className="mb-0" />
      <Container>
        {!hideHeader && (
          <div className="pt-8">
            <Breadcrumb />
          </div>
        )}
        <ProductSingleDetails />
        <RelatedProducts sectionHeading="text-related-products" />
        <Subscription />
      </Container>
    </>
  );
}

ProductPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
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
