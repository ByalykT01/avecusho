/** eslint-disable @next/next/no-img-element */
import { getItems } from "~/server/queries";
import Image from "next/image";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await getItems();
  return (
    <main className="mx-auto sm:mx-auto md:px-5 lg:px-10">
      <div className="grid grid-cols-1 gap-5 sm:mx-auto sm:grid-cols-1 sm:gap-5 md:grid-cols-3 md:gap-4 lg:grid-cols-5 lg:gap-8">
        {items.map((item) => (
          <div key={item.id} className="relative overflow-hidden rounded-[5%]">
            <Link href={`/items/${item.id}`}>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className="h-[60vw] w-[70vw] sm:w-[70vw] md:w-full lg:w-full object-cover sm:h-[60vw] md:h-[35vw] lg:h-[20vw]"
                src={item.url}
                alt="item"
                priority
              />
              {/* Responsive layout for name and price */}
              <div className="absolute inset-x-0 bottom-0 flex flex-row justify-between bg-description bg-opacity-75 p-3 text-white sm:h-[25%] lg:h-[20%] lg:flex-col lg:items-start">
                <h2 className="text-lg leading-tight tracking-wide md:text-xl lg:text-lg">
                  {item.name}
                </h2>
                <p className="text-sm font-semibold tracking-tight md:text-base lg:text-lg">
                  zł {item.price}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
