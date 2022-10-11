import Layout from "@components/layout/layout";
import Container from "@components/ui/container";
import PageHeader from "@components/ui/page-header";
import { termsAndServices } from "@settings/terms-settings";
import { Link, Element } from "react-scroll";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";

function makeTitleToDOMId(title: string) {
  return title.toLowerCase().split(" ").join("_");
}

export default function TermsPage() {
  const { t } = useTranslation("terms");
  return (
    <>
      <div className="mt-12 lg:mt-14 xl:mt-16 lg:py-1 xl:py-0 border-b border-gray-300 px-4 md:px-10 lg:px-7 xl:px-16 2xl:px-24 3xl:px-32 pb-9 md:pb-14 lg:pb-16 2xl:pb-20 3xl:pb-24">
        <Container>
          <div className="flex flex-col md:flex-row w-full">
            {/* End of section scroll spy menu */}

            <div className="md:w-9/12 md:ps-8 ">
              {termsAndServices?.map((item) => (
                // @ts-ignore
                <Element
                  key={item.title}
                  id={makeTitleToDOMId(item.title)}
                  className="mb-10"
                >
                  <h2 className="text-lg md:text-xl lg:text-2xl text-heading font-bold mb-4">
                    Return Policy
                  </h2>
                  <div
                    className="text-heading text-sm leading-7 lg:text-base lg:leading-loose"
                    dangerouslySetInnerHTML={{
                      __html: t(`${item.description}`),
                    }}
                  />
                </Element>
              ))}
            </div>
            {/* End of content */}
          </div>
        </Container>
      </div>
    </>
  );
}

TermsPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "terms",
        "footer",
      ])),
    },
  };
};
