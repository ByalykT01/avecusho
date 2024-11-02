"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useCurrentUser } from "hooks/use-current-user";

interface CheckoutSessionData {
  status: string | null;
  customer_email: string | null;
}

export default function Return() {
  const [status, setStatus] = useState<string | null>(null);
  const [isItemUpdated, setIsItemUpdated] = useState(false);
  const user = useCurrentUser();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    // Extract itemId from URL path
    const pathSegments = window.location.pathname.split("/");
    const itemId = pathSegments[2]; // Assumes URL pattern is /purchase/{itemId}/return

    if (sessionId && user?.id) {
      // First API call to check session status
      fetch(`/api/checkout_sessions?session_id=${sessionId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data: CheckoutSessionData) => {
          setStatus(data.status);

          // If payment is complete, make the second API call to update item status
          if (data.status === "complete" && !isItemUpdated) {
            console.log({ itemId: itemId, userId: user?.id });
            // return fetch(`/api/item/bought?itemId=${itemId}&userId=${user?.id}`, {
            //   method: "POST",
            // });
            return fetch("/api/item/bought", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ itemId: itemId, userId: user?.id }),
            });
          }
        })
        .then((res) => {
          if (res) {
            setIsItemUpdated(true);
          }
        })
        .catch((error) => {
          console.error("Error in API calls:", error);
        });
    }
  }, [isItemUpdated, user?.id]);

  if (status === "open") {
    redirect("/");
  }

  if (status === "complete") {
    return (
      <section
        id="success"
        className="m-auto flex flex-col items-center justify-center bg-green-100 p-4"
      >
        <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
          <h1 className="mb-4 text-2xl font-semibold text-green-600">
            Thank You!
          </h1>
          <p className="mb-6 text-lg text-gray-700">
            We appreciate your business!
          </p>
          <p className="text-gray-500">
            If you have any questions, please email{" "}
            <a
              href="mailto:byalykt@hotmail.com"
              className="text-blue-500 underline"
            >
              byalykt@hotmail.com
            </a>
            .
          </p>
        </div>
      </section>
    );
  }

  return null;
}
