"use client";

import { useEffect, useState } from "react";
import type { CartItemData, Item } from "~/lib/definitions";
import { useRouter } from "next/navigation";
import Spinner from "../spinner";
import CartItem from "./cart-item";

export const dynamic = "force-dynamic";

export default function CartItems(props: { userId: string }) {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [itemData, setItemData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/cart/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: props.userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = (await response.json()) as CartItemData[];
        setCartItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCartItems().catch(console.error);
  }, [props.userId]);

  useEffect(() => {
    const fetchItemData = async () => {
      if (cartItems.length === 0) {
        console.log("Cart is empty, skipping item data fetch");
        return;
      }
      try {
        const fetchPromises = cartItems.map(async (cartItem) => {
          const response = await fetch("/api/cart/item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              itemId: cartItem.itemId,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch data for item ${cartItem.cartId}`);
          }

          const data = (await response.json()) as Item[];
          return Array.isArray(data) ? data : [data];
        });
        const allItems = await Promise.all(fetchPromises);
        setItemData(allItems.flat());
      } catch (e) {
        console.error(e);
      }
    };

    fetchItemData().catch(console.error);
  }, [cartItems]);

  const handleRemove = async (itemId: number) => {
    const reqBody = {
      itemId,
      userId: props.userId ?? "",
    };

    try {
      const response = await fetch("/api/cart/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      if (!response.ok) {
        throw new Error("Failed to delete item from cart");
      }

      setCartItems((prev) => prev.filter((item) => item.itemId !== itemId));
      setItemData((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="mt-28 flex flex-col items-center">
        <Spinner />
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (itemData.length === 0) {
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
      {itemData.map((item) => (
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
