"use client";

import React, { useCallback } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import type { Stripe as StripeApi } from "stripe";
import { useCurrentUser } from "hooks/use-current-user";
import { usePathname } from "next/navigation";

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface PaymentSecretResponse {
  clientSecret: string;
}

export default function App({
  params: { id: itemId },
}: {
  params: { id: string };
}) {
  const idAsNumber = Number(itemId);
  const userId = useCurrentUser()?.id;
    const currentPath = usePathname();
  //find the item obj
  const fetchItem = useCallback(async () => {
    try {
      const res = await fetch("/api/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: itemId }),
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      const data = (await res.json()) as StripeApi.Product;

      console.log(data.default_price);
      if (!data.default_price) {
        throw new Error("Default price is missing from the item response");
      }
      return data;
    } catch (error) {
      throw error;
    }
  }, [itemId]);

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    try {
      const item = await fetchItem();
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          default_price: item.default_price as string,
          itemId: idAsNumber,
          userId: userId,
                    returnPath: currentPath,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = (await res.json()) as PaymentSecretResponse;

      if (!data.clientSecret) {
        throw new Error("clientSecret not found in response");
      }

      return data.clientSecret;
    } catch (error) {
      throw error;
    }
  }, [fetchItem, idAsNumber, userId, currentPath]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout" className="w-full mt-12">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}