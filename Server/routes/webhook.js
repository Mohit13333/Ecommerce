import express from "express";
import { Order } from "../model/Order.js";
import stripeLib from "stripe";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const stripe = stripeLib(process.env.STRIPE_SERVER_KEY);
const endpointSecret = process.env.ENDPOINT_SECRET;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;

        // Retrieve the order using the metadata
        const orderId = paymentIntentSucceeded.metadata.orderId;
        try {
          const order = await Order.findById(orderId);
          if (!order) {
            console.error(`Order not found: ${orderId}`);
            return response.status(404).send(`Order not found: ${orderId}`);
          }

          // Update the order's payment status
          order.paymentStatus = "paid"; // or "completed" based on your application logic
          await order.save();

          console.log(`Order updated: ${orderId}, payment status: ${order.paymentStatus}`);
        } catch (error) {
          console.error(`Error updating order: ${error.message}`);
          return response.status(500).send(`Error updating order: ${error.message}`);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Acknowledge receipt of the event
    response.json({ received: true });
  }
);

export { router };
