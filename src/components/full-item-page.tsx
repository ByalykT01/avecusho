import { getOneItem } from "~/server/queries";
import FullItemText from "./item-page-text";
import Image from "next/image";
import Link from "next/link";

export default async function FullItemImageView(props: { id: number }) {
  const item = await getOneItem(props.id);
  return (
    <div className="flex h-full w-full">
      <div className="m-auto flex h-[90%] w-[90%] flex-col overflow-y-auto rounded-lg bg-zinc-50 md:flex-row lg:flex-row">
        <Link
          href={item.url} passHref legacyBehavior
          
        >
        <a target="_blank" className="mx-auto my-4 flex w-[90%] items-center justify-center md:w-1/2 lg:w-1/3">
          <Image
            src={item.url}
            width="0"
            height="0"
            sizes="100vw"
            priority
            alt="item image"
            className="mt-5 h-auto w-full max-w-[500px] object-cover shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          />
          </a>
        </Link>
        <FullItemText item={item} />
      </div>
    </div>
  );
}
