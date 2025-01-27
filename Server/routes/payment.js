import express from "express";
import stripeLib from "stripe";

const router = express.Router();
const stripe = stripeLib(process.env.STRIPE_SERVER_KEY);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { totalAmount, orderId } = req.body;
    if (!totalAmount || !orderId) {
      return res
        .status(400)
        .json({ error: "totalAmount and orderId are required" });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "inr",
      automatic_payment_methods: { enabled: true },
      metadata: { orderId },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router };
