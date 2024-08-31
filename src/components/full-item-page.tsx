import { getOneItem } from "~/server/queries";
import FullItemText from "./item-page-text";

export default async function FullItemImageView(props: { id: number }) {
  const item = await getOneItem(props.id);
  return (
    <div className="flex h-full w-full">
      <div className="m-auto flex h-[90%] w-[90%] flex-col bg-zinc-50 md:flex-row lg:flex-row">
        <div className="my-4 flex w-full items-center justify-center md:w-1/2 lg:w-1/2">
          <img
            src={item.url}
            className="mt-5 w-2/3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:w-2/3 md:w-2/3 lg:w-2/3"
          />
        </div>
        <FullItemText item={item} />
      </div>
    </div>
  );
}
