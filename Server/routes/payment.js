import express from "express";
import stripeLib from "stripe";

const router = express.Router();
const stripe = stripeLib(process.env.STRIPE_SERVER_KEY);

router.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "inr",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId },
  });

  res.send({ clientSecret: paymentIntent.client_secret });
});

export { router };
