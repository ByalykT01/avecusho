import { getOneItem } from "~/server/queries";
import FullItemText from "./item-page-text";
import Image from "next/image";

export default async function FullItemImageView(props: { id: number }) {
  const item = await getOneItem(props.id);
  return (
    <div className="flex h-full w-full">
      <div className="m-auto flex h-[90%] w-[90%] flex-col bg-zinc-50 md:flex-row lg:flex-row">
        <div className="my-4 flex w-full items-center justify-center md:w-1/2 lg:w-1/2">
          <Image
            src={item.url}
            width="0"
            height="0"
            sizes="100vw"
            priority
            alt="item image"
            className="mt-5 w-3/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] object-cover sm:w-3/5 md:w-2/3 lg:w-2/3 "
          />
        </div>
        <FullItemText item={item} />
      </div>
    </div>
  );
}
