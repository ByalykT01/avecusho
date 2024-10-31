"use client";

import React, { useCallback, useEffect, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import type { Stripe as StripeApi } from "stripe";
import { useCurrentUser } from "hooks/use-current-user";
import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "routes";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";

// Move this outside component to avoid recreating on each render
const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentSecretResponse {
  clientSecret: string;
}

interface CheckoutErrorProps {
  message: string;
}

const CheckoutError = ({ message }: CheckoutErrorProps) => (
  <Alert variant="destructive" className="mt-4">
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default function CheckoutPage({
  params: { id: itemId },
}: {
  params: { id: string };
}) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useCurrentUser();
  const idAsNumber = Number(itemId);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      redirect("/auth/login");
    }
  }, [currentUser]);

  const fetchItem = useCallback(async () => {
    try {
      const res = await fetch("/api/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch item: ${res.statusText}`);
      }

      const data = (await res.json()) as StripeApi.Product;

      if (!data.default_price) {
        throw new Error("Product price not found");
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch item";
      throw new Error(errorMessage);
    }
  }, [itemId]);

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!currentUser?.id) {
        throw new Error("User not authenticated");
      }

      const item = await fetchItem();
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          default_price: item.default_price as string,
          itemId: idAsNumber,
          userId: currentUser.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Checkout session creation failed: ${res.statusText}`);
      }

      const data = (await res.json()) as PaymentSecretResponse;

      if (!data.clientSecret) {
        throw new Error("Invalid checkout session response");
      }

      return data.clientSecret;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItem, idAsNumber, currentUser?.id]);

  const options = { fetchClientSecret };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div id="checkout" className="max-w-3xl mx-auto p-4">
      {error ? (
        <CheckoutError message={error} />
      ) : (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout className="min-h-[500px]" />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}