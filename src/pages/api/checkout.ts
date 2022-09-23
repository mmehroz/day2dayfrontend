/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
const stripe = require("stripe")(process.env.STRIPESECRETEKEY);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log(process.env.STRIPESECRETEKEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req?.body?.amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });

    console.log("Completed Backend");
  } catch (err) {
    console.log(err);
    console.log("internal error");
console.log(process.env.STRIPESECRETEKEY);

    res.send(500);
  }
}

console.log(process.env.STRIPESECRETEKEY);
