"use client"

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

interface CheckoutSessionData {
  status: string | null;
  customer_email: string | null;
}

export default function Return() {
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string>('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      fetch(`/api/checkout_sessions?session_id=${sessionId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data: CheckoutSessionData) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email || ''); // Default to an empty string if customer_email is null
        })
        .catch((error) => {
          console.error("Error fetching checkout session:", error);
        });
    }
  }, []);

  if (status === 'open') {
    redirect('/');
  }

  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.
          If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  return null;
}
