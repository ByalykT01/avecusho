"use client";

import type { Item, UserDataProps } from "~/lib/definitions";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  FaUser,
  FaShoppingBag,
  FaCalendar,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useCurrentUser } from "hooks/use-current-user";
import { useEffect, useState } from "react";
import { LogoutButton } from "../auth/logout-button";
import { Button } from "../ui/button";
import Spinner from "../spinner";
import { redirect, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function UserData() {
  const router = useRouter();
  const user = useCurrentUser() as UserDataProps;
  const [boughtItems, setBoughtItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (!user) {
      redirect("/auth/login");
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
          setError(
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          );
        } finally {
          setLoadingItems(false);
          setOpacity(1);
        }
      }
    };

    void fetchBoughtItems();
  }, [user]);

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center" aria-live="polite">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-500">Loading your data...</p>
        </div>
      </div>
    );
  }

  const totalSpent = boughtItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.-]/g, ""));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  const formatPrice = (price: string) => {
    const numericPrice = parseFloat(price.replace(/[^\d.-]/g, ""));
    return isNaN(numericPrice) ? "0.00" : numericPrice.toFixed(2);
  };

  return (
    <div
      className="mx-auto max-w-5xl px-4"
      style={{ opacity, transition: "opacity 0.5s ease-in-out" }}
    >
      <Card className="bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-8">
          <div className="flex flex-col items-center space-y-6 md:flex-row md:space-x-8 md:space-y-0">
            <div className="relative ">
              {user.image ? (
                <div className="h-32 w-32 overflow-hidden rounded-full ring-4 ring-blue-100">
                  <Image
                    src={user.image}
                    width={128}
                    height={128}
                    alt={`${user.name}'s profile picture`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex  h-32 w-32 items-center justify-center rounded-full bg-blue-100">
                  <FaUser className="text-4xl text-blue-500" />
                </div>
              )}
            </div>
            <div className=" text-center md:text-left">
              <CardTitle className="text-3xl font-bold text-gray-900">
                {user.name}
              </CardTitle>
              <p className="mt-2 text-lg text-gray-600">{user.email}</p>
              <div className="w-full">
                <div className="mt-4 justify-center md:justify-start">
                  <Button
                    className=" bg-blue-600 w-1/2 hover:bg-blue-700"
                    onClick={() => router.push("/profile/edit")}
                  >
                    Edit Profile
                  </Button>
                </div>
                <LogoutButton>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    Sign Out
                  </Button>
                </LogoutButton>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="bg-white">
              <CardContent className="flex items-center p-6">
                <FaShoppingBag className="mr-4 text-2xl text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="text-2xl font-bold">{boughtItems.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="flex items-center p-6">
                <FaMoneyBillWave className="mr-4 text-2xl text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold">
                    zł {totalSpent.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="flex items-center p-6">
                <FaCalendar className="mr-4 text-2xl text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Last Purchase</p>
                  <p className="text-2xl font-bold">
                    {boughtItems.length > 0
                      ? new Date(boughtItems[0]?.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-xl font-semibold text-gray-900">
              Purchase History
            </h3>
            {loadingItems ? (
              <div className="flex h-48 items-center justify-center">
                <Spinner />
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4 text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-4 text-left font-semibold text-gray-600">
                        Item Name
                      </th>
                      <th className="pb-4 text-left font-semibold text-gray-600">
                        Price
                      </th>
                      <th className="pb-4 text-left font-semibold text-gray-600">
                        Purchase Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {boughtItems.length > 0 ? (
                      boughtItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-4">{item.name}</td>
                          <td className="py-4">zł {formatPrice(item.price)}</td>
                          <td className="py-4">
                            {item.updatedAt
                              ? new Date(item.updatedAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-8 text-center text-gray-500"
                        >
                          No purchase history available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
