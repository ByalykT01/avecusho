import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Item } from "~/lib/definitions";

export default function ItemCard({ item }: { item: Item }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`transition-opacity duration-1000 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
    <div className="relative overflow-hidden rounded-[5%] transition-transform duration-300 hover:scale-[1.02]">
      <Link href={`/items/${item.id}`}>
        <div >
          <Image
            width={500}
            height={500}
            className="h-[100vw] w-[75vw] object-cover sm:h-[80vw] sm:w-[75vw] md:h-[45vw] md:w-full lg:h-[25vw] lg:w-full"
            src={item.url}
            alt={item.name}
            priority={false}
            quality={85}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-row justify-between bg-description bg-opacity-75 p-3 text-white backdrop-blur-sm sm:h-[25%] lg:h-[20%] lg:flex-col lg:items-start">
          <h2 className="text-lg font-medium leading-tight tracking-wide md:text-xl lg:text-lg">
            {item.name}
          </h2>
          <p className="text-sm font-semibold tracking-tight md:text-base lg:text-lg">
            zł {item.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </div> 
    </div>  
  );
}