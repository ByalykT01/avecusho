"use client";

import React, { useCallback } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface PaymentSecretResponse {
  clientSecret: string;
}

export default function App() {
  const fetchClientSecret = useCallback(async (): Promise<string> => {
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await (res.json()) as PaymentSecretResponse;

      if (!data.clientSecret) {
        throw new Error("clientSecret not found in response");
      }

      return data.clientSecret;
    } catch (error) {
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
