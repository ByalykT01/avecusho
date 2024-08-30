import { getOneItem } from "~/server/queries";

export default async function FullItemImageView(props: { id: number }) {
  const item = await getOneItem(props.id);
  return (
    <div className="flex h-full w-full flex-col md:flex-row lg:flex-row">
      <div className="flex w-full md:w-1/2 lg:w-1/2 flex-shrink items-center justify-center">
        <img src={item.url} className="w-2/3 sm:w-2/3 md:w-2/3 lg:w-2/3" />
      </div>
      <div className="flex flex-col items-center md:items-start w-full md:w-1/2 lg:w-1/2 flex-shrink-0 border-t md:border-t-0 md:border-l border-black mt-4 md:mt-0">
        <div className="text-xl font-bold text-center md:text-left">{item.name}</div>
      </div>
    </div>
  );

}
