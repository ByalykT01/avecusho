"use client";
import type { Item } from "~/lib/definitions";
import { Button } from "./ui/button";
import { useCurrentUser } from "hooks/use-current-user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Frame, Package, Shield, Truck } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

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
      toast.error("Failed to add item to cart. Log In");
    }
  };

  return (
    <div className="mt-6 flex w-full flex-col space-y-6 md:mt-0 md:w-1/2 md:items-start lg:w-1/2">
      <div className="m-6 flex flex-grow flex-col text-zinc-600">
        {item.name.toLowerCase() === "no title" ? (
          <h1 className="my-3 text-3xl font-bold text-gray-400">{item.name}</h1>
        ) : (
          <h1 className="my-3 text-3xl font-bold">{item.name}</h1>
        )}

        {/* Artist Info */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">Artist</p>
          <p className="text-lg font-medium">Khokhliuk Avrora</p>
        </div>

        {/* Artwork Details */}
        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              About the Artwork
            </h2>
            <p className="my-2 text-lg">{item.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Medium</p>
              <p className="text-md">{item.medium || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dimensions</p>
              <p className="text-md">
                {item.dimensions || "Contact for details"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="text-md">{item.year || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Style</p>
              <p className="text-md">{item.style || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Shipping & Authentication */}
        

        <p className="text-md my-4 text-gray-500">
          If you have any questions or need further information about this
          painting, please don&apos;t hesitate to contact me.
        </p>
      </div>

      {/* Price and Purchase Section */}
      <div className="mx-auto mt-auto w-[90%]">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg text-gray-600">Price</p>
          <p className="text-2xl font-semibold">zł {item.price}</p>
        </div>
        <div className="mb-6 flex flex-col space-y-3">
          <Button
            onClick={onClick}
            variant="secondary"
            size="lg"
            className="w-full rounded-md border px-4 py-2 text-lg font-medium text-black hover:bg-gray-200"
          >
            Add to Cart
          </Button>
          <Button
            onClick={handleBuyClick}
            size="lg"
            className="w-full rounded-md border bg-button_initial px-6 py-3 text-lg font-semibold hover:bg-button_onhover"
          >
            Buy Now
          </Button>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="text-sm">Certificate of Authenticity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-600" />
                  <span className="text-sm">Secure Packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-gray-600" />
                  <span className="text-sm">Insured Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Frame className="h-5 w-5 text-gray-600" />
                  <span className="text-sm">Ready to Hang</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
