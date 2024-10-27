"use client";

import { useEffect, useState, useCallback } from "react";
import type { CartItemData, Item } from "~/lib/definitions";
import { useRouter } from "next/navigation";
import Spinner from "../spinner";
import CartItem from "./cart-item";

export const dynamic = "force-dynamic";

export default function CartItems({ userId }: { userId: string }) {
  const [cartState, setCartState] = useState<{
    items: CartItemData[];
    itemDetails: Item[];
    loading: boolean;
  }>({
    items: [],
    itemDetails: [],
    loading: true,
  });
  const router = useRouter();

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to fetch cart items");
      return (await response.json()) as CartItemData[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [userId]);

  const fetchItemDetails = useCallback(async (cartItems: CartItemData[]) => {
    if (!cartItems.length) return [];

    try {
      const responses = await Promise.all(
        cartItems.map((item) =>
          fetch("/api/cart/item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId: item.itemId }),
          }),
        ),
      );

      const data = await Promise.all(
        responses.map(async (response) => {
          if (!response.ok) throw new Error("Failed to fetch item details");
          const result = (await response.json()) as Item[];
          return Array.isArray(result) ? result : [result];
        }),
      );

      return data.flat();
    } catch (error) {
      console.error(error);
      return [];
    }
  }, []);

  const handleRemove = async (itemId: number) => {
    try {
      const response = await fetch("/api/cart/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, userId }),
      });

      if (!response.ok) throw new Error("Failed to delete item from cart");

      setCartState((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.itemId !== itemId),
        itemDetails: prev.itemDetails.filter((item) => item.id !== itemId),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const initializeCart = async () => {
      setCartState((prev) => ({ ...prev, loading: true }));
      const cartItems = await fetchCartItems();
      const itemDetails = await fetchItemDetails(cartItems);

      setCartState({
        items: cartItems,
        itemDetails,
        loading: false,
      });
    };

    void initializeCart();
  }, [fetchCartItems, fetchItemDetails]);

  if (cartState.loading) {
    return (
      <div className="mt-28 flex flex-col items-center">
        <Spinner />
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!cartState.itemDetails.length) {
    return (
      <div className="flex flex-col justify-center pt-16 text-center">
        <h1 className="text-2xl">No items</h1>
        <div className="flex justify-center">
          <p className="w-fit text-xl">
            Add some by clicking &quot;Add to cart&quot; in our shop page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {cartState.itemDetails.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={handleRemove}
          onBuy={() => router.push(`/purchase/${item.id}`)}
        />
      ))}
    </div>
  );
}
