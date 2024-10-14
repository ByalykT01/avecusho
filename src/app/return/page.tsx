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
          setCustomerEmail(data.customer_email ?? '');
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
      <section id="success" className="flex flex-col items-center justify-center m-auto  bg-green-100 p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center">
          <h1 className="text-2xl font-semibold text-green-600 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-700 mb-6">
            We appreciate your business! A confirmation email will be sent to <span className="font-semibold">{customerEmail}</span>.
          </p>
          <p className="text-gray-500">
            If you have any questions, please email <a href="mailto:orders@example.com" className="text-blue-500 underline">orders@example.com</a>.
          </p>
        </div>
      </section>
    );
  }

  return null;
}
