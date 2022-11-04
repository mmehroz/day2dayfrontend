import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { fadeInTop } from "@utils/motion/fade-in-top";
import Link from "@components/ui/link";
import { useWindowSize } from "@utils/use-window-size";
import { useTranslation } from "next-i18next";
import axios from "axios";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import Cookies from "js-cookie";
import { colorsContext } from "@contexts/colors.context";

const OrdersTable: React.FC = () => {
  const { width } = useWindowSize();
  const { t } = useTranslation("common");
  const [orders, setOrders] = useState<Array<any>>();
  const { theme } = useContext(colorsContext);

  useEffect(() => {
    const userId: any = Cookies.get("current_user_id");

    axios(API_ENDPOINTS?.ORDER_DETAILS, {
      method: "POST",
      data: {
        user_id: parseInt(userId),
      },
    })
      .then((res) => {
        setOrders(res?.data?.orders);
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold mb-6 xl:mb-8">
        {t("text-orders")}
      </h2>
      <motion.div
        layout
        initial="from"
        animate="to"
        exit="from"
        //@ts-ignore
        variants={fadeInTop(0.35)}
        className={`w-full flex flex-col`}
      >
        {width >= 1025 ? (
          <table>
            <thead className="text-sm lg:text-base">
              <tr>
                <th
                  style={{
                    backgroundColor: theme.backgroundColorThird,
                    color: theme.textColor,
                  }}
                  className=" p-4  font-semibold text-start first:rounded-ts-md"
                >
                  {t("text-order")}
                </th>
                <th
                  style={{
                    backgroundColor: theme.backgroundColorThird,
                    color: theme.textColor,
                  }}
                  className="p-4  font-semibold text-start lg:text-center"
                >
                  {t("text-date")}
                </th>
                <th
                  style={{
                    backgroundColor: theme.backgroundColorThird,
                    color: theme.textColor,
                  }}
                  className=" p-4  font-semibold text-start lg:text-center"
                >
                  {t("text-status")}
                </th>
                <th
                  style={{
                    backgroundColor: theme.backgroundColorThird,
                    color: theme.textColor,
                  }}
                  className=" p-4 font-semibold text-start lg:text-center"
                >
                  {t("text-total")}
                </th>
                <th
                  style={{
                    backgroundColor: theme.backgroundColorThird,
                    color: theme.textColor,
                  }}
                  className=" p-4  font-semibold text-start lg:text-end last:rounded-te-md"
                >
                  {t("text-actions")}
                </th>
              </tr>
            </thead>
            <tbody className="text-sm lg:text-base">
              {orders?.map((el, _i) => (
                <tr
                  style={{
                    borderColor: theme.borderColor,
                    color: theme.textColor,
                  }}
                  className="border-b  last:border-b-0"
                >
                  <td className="px-4 py-5 text-start">
                    <Link
                      href={`/my-account/orders/${el?.id}`}
                      className="underline hover:no-underline text-body"
                    >
                      #{el?.id}
                    </Link>
                  </td>
                  <td className="text-start lg:text-center px-4 py-5 ">
                    {new Date(el?.created_at)?.toDateString()}
                  </td>
                  <td className="text-start lg:text-center px-4 py-5 ">
                    {el?.status}
                  </td>
                  <td className="text-start lg:text-center px-4 py-5 ">
                    ${el?.total_amount}
                  </td>
                  <td className="text-end px-4 py-5 ">
                    <Link
                      href={`/my-account/orders/${el?.id}`}
                      className="text-sm leading-4 bg-gradient-to-r from-orange-500  to-pink-500 text-white px-4 py-2.5 inline-block rounded-md hover:text-white hover:bg-gray-600"
                    >
                      {t("button-view")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </motion.div>
    </>
  );
};

export default OrdersTable;
