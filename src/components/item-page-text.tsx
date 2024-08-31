import type { Item } from "~/lib/definitions";
import { Button } from "./ui/button";

export default function FullItemText(props: { item: Item }) {
  const item = props.item;
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
          <Button variant="outline" size="lg" className="mb-3">
            Add to cart
          </Button>
          <Button size="lg">Buy</Button>
        </div>
      </div>
    </div>
  );
}
