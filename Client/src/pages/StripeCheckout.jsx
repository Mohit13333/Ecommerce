import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import axios from "axios";

import CheckoutForm from "./CheckoutForm";
import { selectCurrentOrder } from "../features/order/orderSlice";

const stripePromise = loadStripe(
  "pk_test_51QbFP9LgxkTIPBkHjVJ60y2ubZXwvwk53Ly84PbnAmBxN2jVUHUMn57YObXUaWSuBeT95Dk987R9q3OiYfpSoxze00864RMa0y"
);

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const currentOrder = useSelector(selectCurrentOrder);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!currentOrder || !currentOrder.totalAmount || !currentOrder.id) {
        setError("Invalid order details. Cannot create payment intent.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URI}/create-payment-intent`,
          {
            totalAmount: currentOrder.totalAmount,
            orderId: currentOrder.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError("Failed to create payment intent. Please try again.");
      }
    };

    createPaymentIntent();
  }, [currentOrder]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="Stripe">
      {error && <p className="error-message">{error}</p>}
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        !error && <p>Loading payment information...</p>
      )}
    </div>
  );
}
