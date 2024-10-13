"use client";
import type { Item } from "~/lib/definitions";
import { Button } from "./ui/button";
import { useCurrentUser } from "hooks/use-current-user";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export const dynamic = "force-dynamic";


interface reqBody {
  itemId: number;
  userId: string;
}

interface CartItemAddedResponse {
  message: string;
  cartId: number;
  itemId: number;
}

export default function FullItemText(props: { item: Item }) {
  const user = useCurrentUser();
  const item = props.item;
  
  const router = useRouter();
  
    const handleBuyClick = () => {
      router.push(`/purchase/${item.id}`);
      window.location.reload();

    };

  const reqBody: reqBody = {
    itemId: item.id,
    userId: user?.id ?? "",
  };

  const onClick = async () => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
        toast.error("BAD")
      }

      try {
        const data = await response.json() as CartItemAddedResponse;
        console.log("Item added to cart:", data);
        toast.success("GOOD")
      } catch (error) {
        console.error("Failed to parse response or add item to cart:", error);
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  return (
    <div className="mt-4 flex w-full flex-col md:mt-0 md:w-1/2 md:items-start lg:w-1/2">
      <div className="m-5 flex flex-grow flex-col text-zinc-500">
        <p className="my-3 text-2xl font-bold">{item.name}</p>
        <p className="my-2">{item.description}</p>

        <p className="my-3">
          If you have any questions or need further information about this
          painting, please don&apos;t hesitate to contact me.
        </p>
      </div>

      <div className="mx-auto w-[90%]">
        <p className="mb-2 text-right">${item.price}</p>
        <div className="mb-5 flex flex-col justify-center">
          <Button
            onClick={onClick}
            variant="outline"
            size="lg"
            className="mb-3"
          >
            add to cart
          </Button>
          <Button onClick={handleBuyClick} size="lg">Buy</Button>
        </div>
      </div>
    </div>
  );
}
