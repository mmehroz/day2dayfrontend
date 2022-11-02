import usePrice from "@framework/product/use-price";
import { OrderItem } from "@framework/types";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";

const OrderItemCard = ({ product }: { product: OrderItem }) => {
  const { price: itemTotal } = usePrice({
    amount: product.price * product.quantity,
    currencyCode: "USD",
  });
  return (
    <tr
      className="border-b font-normal border-gray-300 last:border-b-0"
      key={product.id}
    >
      <td className="p-4">
        {product.name} * {product.quantity}
      </td>
      <td className="p-4">{itemTotal}</td>
    </tr>
  );
};

const OrderDetails: React.FC<{
  className?: string;
}> = ({ className = "pt-10 lg:pt-12" }) => {
  const {
    query: { id },
  } = useRouter();

  const [orderDetails, setOrderDetails] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (!orderDetails?.length) return;
    let calculatedTotal = 0;

    orderDetails?.items?.forEach((el: any, _i: number) => {
      calculatedTotal += el?.unit_price;
    });

    setTotal(calculatedTotal);
  }, [orderDetails]);

  useEffect(() => {
    let subscribe: boolean = false;
    if (subscribe) return;

    axios(API_ENDPOINTS.SINGLE_ORDER_DETAILS, {
      method: "POST",
      data: {
        //@ts-ignore
        order_id: parseInt(id),
      },
    })
      .then((res) => {
        (res);
        setOrderDetails(res?.data);
      
      })
      .catch((err) => {
   
      });

    return () => {
      subscribe = true;
    };
  }, [id]);

  const { t } = useTranslation("common");

  return (
    <div className={className}>
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
        {t("text-order-details")}:
      </h2>
      <table className="w-full text-heading font-semibold text-sm lg:text-base">
        <thead>
          <tr>
            <th className="bg-gray-700 p-4 text-start first:rounded-ts-md w-1/2">
              {t("text-product")}
            </th>
            <th className="bg-gray-700 p-4 text-start last:rounded-te-md w-1/2">
              {t("text-total")}
            </th>
          </tr>
        </thead>
        <tbody>
          {orderDetails?.items?.map((el: any, i: number) => {
            return (
              <OrderItemCard
                product={{
                  price: el?.unit_price,
                  name: el?.product_name,
                  quantity: 1,
                  id: el?.order_id,
                }}
              />
            );
          })}
        </tbody>
        <tfoot>
          <tr className="odd:bg-gray-700">
            <td className="p-4 italic">{t("text-sub-total")}:</td>
            <td className="p-4"> ${orderDetails?.paymetdetails?.subtotal}</td>
          </tr>
          <tr className="odd:bg-gray-700">
            <td className="p-4 italic">{t("text-shipping")}:</td>
            <td className="p-4">
              $0
              <span className="text-[13px] font-normal ps-1.5 inline-block">
                via Flat rate
              </span>
            </td>
          </tr>
          <tr className="odd:bg-gray-700">
            <td className="p-4 italic">{t("text-payment-method")}:</td>
            <td className="p-4">
              {orderDetails?.paymetdetails?.payment_method}
            </td>
          </tr>
          <tr className="odd:bg-gray-150">
            <td className="p-4 italic">{t("text-total")}:</td>
            <td className="p-4">
              ${orderDetails?.paymetdetails?.total_amount}
            </td>
          </tr>
          <tr className="odd:bg-gray-700">
            <td className="p-4 italic">{t("text-note")}:</td>
            <td className="p-4">{orderDetails?.message}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderDetails;
