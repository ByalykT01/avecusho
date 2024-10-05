"use client";

import { useEffect, useState } from "react";
import { BuyButton } from "./cart/buy-button";
import Image from "next/image";
import { Button } from "./ui/button";
import type { CartItem, Item } from "~/lib/definitions";

export const dynamic = "force-dynamic";

export default function CartItems(props: { userId: string }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemData, setItemData] = useState<Item[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/cart/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: props.userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = (await response.json()) as CartItem[];

        setCartItems(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartItems().catch(console.error);
  }, [props.userId]);

  useEffect(() => {
    const fetchItemData = async () => {
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

  return (
    <div>
      {itemData.map((item) => {
        if (!item) return null;

        return (
          <div
            key={item.id}
            className="mx-auto mb-4 flex w-full flex-row justify-between bg-zinc-100 p-5"
          >
            <div className="flex flex-row">
              <div className="mr-5 h-full">
                <Image
                  width={0}
                  height={0}
                  sizes="100wv"
                  className="h-32 w-32"
                  src={item?.url ?? "public/avecusho.svg"}
                  alt="item"
                  priority
                />
              </div>
              <div className="my-auto">
                <p>Item ID: {item?.id}</p>
                <p>Name: {item?.name}</p>
                <p>Price: {item?.price}</p>
              </div>
            </div>
            <div className="flex flex-col justify-evenly">
              <BuyButton label="buy" />
              <Button
                variant="destructive"
                className="w-full"
                size="sm"
                onClick={() => handleRemove(item.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
