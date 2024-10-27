import Image from "next/image";
import type { Item } from "~/lib/definitions";
import { BuyButton } from "./buy-button";
import { RemoveButton } from "./remove-button";

interface CartItemProps {
  item: Item;
  onRemove: (itemId: number) => Promise<void>;
  onBuy: () => void;
}

const CartItem = ({ item, onRemove, onBuy }: CartItemProps) => {
  const defaultImage = "/public/avecusho.svg";

  return (
    <div className="flex w-full flex-col items-start justify-between rounded-lg bg-white p-4 shadow-lg transition-transform duration-200 hover:shadow-xl md:flex-row md:items-center">
      <div className="mb-4 flex w-full items-center justify-center md:mb-0 md:w-auto">
        <a href={`/items/${item.id}`}>
          <div className="relative h-60 w-60 md:h-40 md:w-40">
            <Image
              fill
              className="object-cover"
              src={item?.url ?? defaultImage}
              alt={item?.name ?? "Product image"}
              priority
            />
          </div>
        </a>
      </div>

      <div className="flex w-full flex-grow flex-col space-y-2 text-center md:ml-5 md:w-auto md:text-left">
        <h3 className="text-base font-semibold text-gray-800 md:text-lg">
          {item?.name}
        </h3>
        <p className="text-lg font-bold text-gray-900 md:text-xl">
          {item?.price} PLN
        </p>
      </div>

      <div className="mt-4 flex w-full flex-col space-y-2 md:ml-4 md:mt-0 md:w-auto">
        <BuyButton onClick={onBuy} />
        <RemoveButton onClick={() => onRemove(item.id)} />
      </div>
    </div>
  );
};

export default CartItem;
