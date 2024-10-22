"use client";
import type { Item } from "~/lib/definitions";
import { Button } from "./ui/button";
import { useCurrentUser } from "hooks/use-current-user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
      }

      const data = (await response.json()) as CartItemAddedResponse;
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Failed to add item to cart.");
    }
  };

  return (
    <div className="mt-6 flex w-full flex-col md:mt-0 md:w-1/2 md:items-start lg:w-1/2">
      <div className="m-6 flex flex-grow flex-col text-zinc-600">
        <h1 className="my-3 text-3xl font-bold">{item.name}</h1>
        <p className="my-2 text-lg">{item.description}</p>

        <p className="text-md my-4 text-gray-500">
          If you have any questions or need further information about this
          painting, please don&apos;t hesitate to contact me.
        </p>
      </div>

      <div className="mx-auto mt-auto w-[90%]">
        <p className="mb-4 text-right text-2xl font-semibold">
          zł {item.price}
        </p>
        <div className="mb-6 flex flex-col justify-center">
          <Button
            onClick={onClick}
            variant="outline"
            size="lg"
            className="mb-4"
          >
            Add to Cart
          </Button>
          <Button
            onClick={handleBuyClick}
            size="lg"
            className="bg-[#0f4f51] text-white hover:bg-[#578485]"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
