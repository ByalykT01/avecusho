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
  return (
    <div className="flex w-full flex-col items-start justify-between rounded-lg bg-white p-4 shadow-lg transition-transform duration-200 hover:shadow-xl md:flex-row md:items-center">
      {/* Image Section */}
      <div className="mb-4 w-full  items-center justify-center flex md:mb-0 md:w-auto">
        <a href={`/items/${item.id}`}>
          <div
            className="h-60 w-60 bg-cover bg-center md:h-40 md:w-40"
            style={{
              backgroundImage: `url(${item?.url ?? "/public/avecusho.svg"})`,
            }}
          >
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="object-cover"
              src={item?.url ?? "/public/avecusho.svg"}
              alt="item"
              priority
            />
          </div>
        </a>
      </div>
      <div className="flex w-full flex-grow flex-col space-y-2 text-center  md:ml-5 md:w-auto md:text-left">
        <h3 className="text-base font-semibold text-gray-800 md:text-lg">
          {item?.name}
        </h3>
        <p className="text-lg font-bold text-gray-900 md:text-xl">
          {item?.price} PLN
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex w-full flex-col space-y-2 md:ml-4 md:mt-0 md:w-auto">
        <BuyButton onClick={onBuy} />
        <RemoveButton onClick={() => onRemove(item.id)} />
      </div>
    </div>
  );
};

export default CartItem;
