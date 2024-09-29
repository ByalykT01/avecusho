import { getCartItems, getItemFromCart } from "~/server/queries";
import { RemoveButton } from "./cart/remove-button";
import { BuyButton } from "./cart/buy-button";
import Image from "next/image";
export const dynamic = "force-dynamic";

export default async function CartItems(props: { userId: string }) {
  const cartItems = await getCartItems(props.userId);

  if (!cartItems) {
    return null;
  }

  const itemsFromCart = await Promise.all(
    cartItems.map(async (cartItem) => {
      if (cartItem.itemId !== null) {
        const itemDetails = await getItemFromCart(cartItem.itemId);
        return itemDetails;
      }
      return null;
    }),
  );
  return (
    <div>
      {itemsFromCart.map((item) => (
        <div
          key={item?.id}
          className="mx-auto mb-4 flex w-full flex-row justify-between bg-zinc-100 p-5"
        >
          <div className="flex flex-row">
            <div className="mr-5 h-full w-2/5">
              <Image
                width={0}
                height={0}
                sizes="100wv"
                className="h-full w-full object-cover"
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
            <RemoveButton label="remove" />
          </div>
        </div>
      ))}
    </div>
  );
}
