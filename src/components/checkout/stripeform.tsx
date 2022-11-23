//@ts-nocheck

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Button from "@components/ui/button";
import { ROUTES } from "@utils/routes";

const CheckoutForm = ({ handleClose, price, placeOrder }: any): JSX.Element => {
  const Router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [stripeLoaded, setStripeLoaded] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let tid: any;

    if (tid) {
      clearTimeout(tid);
    }

    tid = setTimeout(() => {
      setStripeLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(tid);
    };
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const { error } = await stripe.confirmPayment({
      elements,
      
      confirmParams: {
        return_url:
          process?.env?.NODE_ENV === "development"
            ? "http://localhost:3000/payment/success"
            : "https://social-theta-eight.vercel.app/payment/success",
        payment_method_data: {},
      },
      redirect: "if_required",
    });

    if (!error?.type) {
      placeOrder();
      handleClose();
      Router.push(ROUTES.ORDER);
    }

    //@ts-ignore
    if (error?.type === "card_error" || error?.type === "validation_error") {
      //@ts-ignore
      setMessage(error.message);
      return;
    } else {
      setMessage("An unexpected error occurred.");
      return;
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="w-full">
      <PaymentElement id="payment-element" />
      {stripeLoaded && (
        <div className="w-full items-center flex h-full  mt-4 flex-col gap-2">
          <div className="w-full flex flex-col gap-2">
            <span className="text-tiny font-regular ">Amount Paypable</span>
            <input
              className="w-full p-2 rounded-md outline-none border bg-transparent border-gray-300"
              value={price}
              disabled
            />
          </div>
          <Button className="w-full mt-4 sm:w-auto bg-gradient-to-r from-orange-500  to-pink-500">
            Pay Now
          </Button>
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
