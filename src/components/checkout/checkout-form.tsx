import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import TextArea from "@components/ui/text-area";
import { useCheckoutMutation } from "@framework/checkout/use-checkout";
import { CheckBox } from "@components/ui/checkbox";
import Button from "@components/ui/button";
import Router from "next/router";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";
import React, {
  ChangeEvent,
  MouseEventHandler,
  useState,
  useEffect,
} from "react";
import { useCart } from "@contexts/cart/cart.context";
import StripeForm from "./stripeform";
import usePrice from "@framework/product/use-price";
import Cookies from "js-cookie";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";

const stripePromise = loadStripe(
  "pk_test_51LlCssCVRAHAPBm9moh5aAbTUwjSTPLBzLS7YzORjpqZNsgqegAsBfGbQEDJRJT9DwooY66Peu1O7TYA4oDJowJt00ncXw0GvS"
);

interface CheckoutInputType {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  save: boolean;
  note: string;
  coupon: string;
}

const CheckoutForm: React.FC = () => {
  const { total, items, clearItemFromCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [showStripe, setShowStripe] = useState<boolean>(false);
  const { price } = usePrice({
    amount: total,
    currencyCode: "USD",
  });
  const [orders, setOrders] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    postCode: "",
  });

  useEffect(() => {
    const accountDetailsRaw = localStorage.getItem("account-details");
    if (!accountDetailsRaw) return;
    const accDetails = JSON.parse(accountDetailsRaw);
    console.log("account details: ", accDetails);

    updateUser(accDetails);
    setOrders({
      ...accDetails,
      phone: accDetails?.phoneNumber,
      postCode: accDetails?.postcode,
    });
  }, []);

  const handleChange = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setOrders({ ...orders, [name]: e.target.value });
  };

  const { t } = useTranslation();
  const { mutate: updateUser, isLoading } = useCheckoutMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInputType>();

  async function placeOrder() {
    try {
      const userId: any = Cookies.get("current_user_id");
      if (!parseInt(userId)) throw new Error("user not loggin");

      const filteredArr = items.map((el, _i) => {
        return {
          product_id: el.id,
          variant: null,
          size: null,
          qty: el.quantity,
          unit_price: el.price,
        };
      });

      const input = orders;
      await axios("https://portal.day2daywholesale.com/api/createorder", {
        method: "POST",
        data: {
          item: filteredArr,
          name: input.firstName + input.lastName,
          email: input.email,
          phone: input.phone,
          address: input.address,
          shipping_method: "null",
          payment_method: "stripe",
          amount: total,
          shipping_fee: 0,
          total_amount: total,
          user_id: parseInt(userId),
        },
      });

      setOrders({
        firstName: "",
        lastName: "",
        address: "",
        phone: "",
        email: "",
        city: "",
        postCode: "",
      });

      items.map((el) => clearItemFromCart(el?.id));
    } catch (err) {}
  }

  async function onSubmit(input: CheckoutInputType) {
    try {
      if (!orders.firstName) throw new Error("First Name Required");

      if (!orders?.lastName) throw new Error("Last Name Required");
      if (!orders?.address) throw new Error("Address Required");
      if (!orders?.email) throw new Error("Email Required");
      if (!orders?.phone) throw new Error("Number required");

      updateUser(input);
      await payWithCard();
    } catch (err) {
      toast(err?.message, {
        progressClassName: "fancy-progress-bar",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  const payWithCard = async () => {
    try {
      if (errors.firstName) {
        return;
      }
      const res = await axios({
        url: "/api/checkout",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ amount: parseFloat(total?.toString() + "00") }),
      });
      setClientSecret(res?.data?.clientSecret);
      setShowStripe(true);
    } catch (err) {
      //@ts-ignore
    }
  };

  const handleClose = () => {
    setShowStripe(false);
  };

  return (
    <>
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
        {t("text-shipping-address")}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-center "
        noValidate
      >
        <div className="flex flex-col space-y-4 lg:space-y-5">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              labelKey="forms:label-first-name"
              {...register("firstName", {
                // required: "forms:first-name-required",
              })}
              errorKey={errors.firstName?.message}
              variant="solid"
              className="w-full lg:w-1/2 "
              onChange={handleChange("firstName")}
              value={orders.firstName}
              defaultValue={orders.firstName}
            />
            <Input
              labelKey="forms:label-last-name"
              {...register("lastName", {
                // required: "forms:last-name-required",
              })}
              errorKey={errors.lastName?.message}
              variant="solid"
              className="w-full lg:w-1/2 lg:ms-3 mt-2 md:mt-0"
              onChange={handleChange("lastName")}
              value={orders.lastName}
            />
          </div>
          <Input
            labelKey="forms:label-address"
            {...register("address", {
              // required: "forms:address-required",
            })}
            errorKey={errors.address?.message}
            variant="solid"
            onChange={handleChange("address")}
            value={orders.address}
          />
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              type="tel"
              labelKey="forms:label-phone"
              {...register("phone", {
                // required: "forms:phone-required",
              })}
              errorKey={errors.phone?.message}
              variant="solid"
              className="w-full lg:w-1/2"
              onChange={handleChange("phone")}
              value={orders.phone}
            />

            <Input
              type="email"
              labelKey="forms:label-email-star"
              {...register("email", {
                // required: "forms:email-required",
                pattern: {
                  value:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "forms:email-error",
                },
              })}
              errorKey={errors.email?.message}
              variant="solid"
              className="w-full lg:w-1/2 lg:ms-3 mt-2 md:mt-0"
              onChange={handleChange("email")}
              value={orders.email}
              id="contact-us-email"
            />
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              labelKey="forms:label-city"
              {...register("city")}
              variant="solid"
              className="w-full lg:w-1/2 "
              onChange={handleChange("city")}
              value={orders.city}
            />

            <Input
              labelKey="forms:label-postcode"
              {...register("zipCode")}
              variant="solid"
              className="w-full lg:w-1/2 lg:ms-3 mt-2 md:mt-0"
              onChange={handleChange("postCode")}
              value={orders.postCode}
            />
          </div>
          <div className="relative flex items-center ">
            <CheckBox
              className="check-out-check-box"
              labelKey="forms:label-save-information"
            />
          </div>

          <TextArea
            labelKey="forms:label-order-notes"
            {...register("note")}
            placeholderKey="forms:placeholder-order-notes"
            className="relative pt-3 xl:pt-6"
          />
          <div className="flex w-full gap-4">
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500  to-pink-500"
              loading={isLoading}
              disabled={isLoading}
              type="submit"
            >
              Pay With Card
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              labelKey="forms:label-coupon"
              // {...register("coupon")}
              variant="solid"
              className="w-full lg:w-1/1 "
              name={""}
            />
            <Button
              className=" verify w-full lg:w-1/2 lg:ms-3 lg:h-1/2 bg-gradient-to-r from-orange-500  to-pink-500"
              // loading={isLoading}
              // disabled={isLoading}
            >
              {t("common:button-verify-coupon")}
            </Button>
          </div>
        </div>
      </form>
      <AnimatePresence>
        {showStripe && (
          <motion.div
            initial={{ y: "150%" }}
            animate={{ y: "10%" }}
            exit={{ y: "150%" }}
            transition={{ type: "keyframes" }}
            className="w-[30rem] h-[80%] flex-col px-10 shadow-xl bg-white fixed left-[35%] top-14 rounded-xl flex items-center justify-center overflow-y-scroll z-[9999]"
          >
            <div className="w-full flex justify-end mb-1">
              <div
                onClick={() => setShowStripe(false)}
                className="w-[2rem] cursor-pointer h-[2rem] rounded-full flex items-center justify-center text-white font-semibold  bg-gradient-to-tr from-orange-800 to-orange-500  animate-shine"
              >
                <h2>X</h2>
              </div>
            </div>
            {clientSecret && (
              <Elements
                options={{
                  appearance: { theme: "stripe", labels: "floating" },
                  clientSecret,
                }}
                stripe={stripePromise}
              >
                <StripeForm
                  handleClose={handleClose}
                  price={price}
                  placeOrder={placeOrder}
                />
              </Elements>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CheckoutForm;
