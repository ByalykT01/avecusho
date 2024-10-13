"use client";

import React, { useCallback } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function App() {
  const fetchClientSecret = useCallback(async (): Promise<string> => {
    try {
      console.log("Making fetch request to /api/checkout_sessions"); // Debugging log
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      console.log("Received response:", res); // Debugging log

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Response data:", data); // Debugging log

      if (!data.clientSecret) {
        throw new Error("clientSecret not found in response");
      }

      return data.clientSecret as string;
    } catch (error) {
      console.error("fetchClientSecret failed:", error); // Debugging log
      throw error;
    }
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout" className="mx-auto">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
