import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from 'react-redux';
import axios from "axios"; // Import axios

import CheckoutForm from "./CheckoutForm";
import "../Stripe.css";
import { selectCurrentOrder } from "../features/order/orderSlice";

// Move loadStripe into an async function to avoid direct await usage
const stripePromise = loadStripe("pk_test_51QbFP9LgxkTIPBkHjVJ60y2ubZXwvwk53Ly84PbnAmBxN2jVUHUMn57YObXUaWSuBeT95Dk987R9q3OiYfpSoxze00864RMa0y");

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const currentOrder = useSelector(selectCurrentOrder);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!currentOrder) return; // Ensure currentOrder is defined

      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/create-payment-intent`, {
          totalAmount: currentOrder.totalAmount,
          orderId: currentOrder.id,
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          }
        });

        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    createPaymentIntent();
  }, [currentOrder]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="Stripe">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
