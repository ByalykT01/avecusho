/** eslint-disable @next/next/no-img-element */
import { getItems } from "~/server/queries";
import Image from "next/image";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await getItems();
  return (
    <main className="px-5 sm:px-5 md:px-5 lg:px-10">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5 lg:gap-12">
        {items.map((item) => (
          <div key={item.id} className="relative overflow-hidden rounded-[5%]">
            <Link href={`/items/${item.id}`}>
              {/* Image */}
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className="h-[45vw] w-full object-cover sm:h-[45vw] md:h-[35vw] lg:h-[20vw]"
                src={item.url}
                alt="item"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 flex h-[30%] items-end justify-between bg-gradient-to-t from-description via-description/80 to-transparent p-2 text-white">
                <h2 className="text-lg font-bold md:text-xl lg:text-2xl">
                  {item.name}
                </h2>
                <p className="text-sm md:text-base">zł {item.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
