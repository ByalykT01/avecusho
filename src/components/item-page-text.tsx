import type { Item } from "~/lib/definitions";

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
        <p className="mb-2 text-right">{item.price}</p>
        <div className="mb-5 flex flex-col justify-center">
          <button
            type="button"
            className="mb-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600"
          >
            Add to cart
          </button>
          <button
            type="button"
            className="w-full rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
