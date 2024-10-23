"use client";

import type { Item, UserDataProps } from "~/lib/definitions";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "hooks/use-current-user";
import { useEffect, useState } from "react";
import { LogoutButton } from "../auth/logout-button";
import { Button } from "../ui/button";
import Spinner from "../spinner";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function UserData() {
  const user = useCurrentUser() as UserDataProps;
  const [boughtItems, setBoughtItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      window.location.reload();
    }
  }, [user]);

  useEffect(() => {
    const fetchBoughtItems = async () => {
      if (user) {
        try {
          const res = await fetch(`/api/bought-items`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.id }),
          });

          if (!res.ok) {
            throw new Error(`Error fetching bought items: ${res.statusText}`);
          }

          const data = (await res.json()) as Item[];
          setBoughtItems(data);
        } catch (error) {
          setError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
          setLoadingItems(false);
        }
      }
    };

    void fetchBoughtItems();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center text-gray-500" aria-live="polite">
        <Spinner />
        <p>Loading your data...</p>
      </div>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-3xl border-0 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-4">
          {user.image ? (
            <Image
              src={user.image}
              width={100}
              height={100}
              alt={`${user.name}'s profile picture`}
              className="rounded-full border-2 border-gray-200"
            />
          ) : (
            <FaUser className="text-5xl text-gray-500" />
          )}
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {user.name}
            </CardTitle>
            <p className="text-lg text-gray-600">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="mt-4 flex justify-center">
          <LogoutButton>
            <Button className="rounded px-6 py-2 font-bold text-white shadow transition duration-300">
              Log Out
            </Button>
          </LogoutButton>
        </div>

        {/* Bought Items Table */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold">Bought Items</h3>
          {loadingItems ? (
            <Spinner />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full mt-4 border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Item Name</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Date Purchased</th>
                </tr>
              </thead>
              <tbody>
                {boughtItems.length > 0 ? (
                  boughtItems.map((item) => {
                    const datePurchased = item.updatedAt ? new Date(item.updatedAt) : null;
                    const formattedDate = datePurchased ? datePurchased.toLocaleDateString() : "N/A";

                    return (
                      <tr key={item.id}>
                        <td className="border px-4 py-2">{item.name}</td>
                        <td className="border px-4 py-2">zł {item.price}</td>
                        <td className="border px-4 py-2">{formattedDate}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="border px-4 py-2 text-center">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
