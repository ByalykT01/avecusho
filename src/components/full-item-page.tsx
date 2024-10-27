"use client";
import FullItemText from "./item-page-text";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Item } from "~/lib/definitions";

export default function FullItemImageView(props: { id: number }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeItem = async () => {
      try {
        const res = await fetch("/api/items/oneitem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: props.id }),
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }

        const fetchedItem = (await res.json()) as Item;
        setItem(fetchedItem);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    void initializeItem();
  }, [props.id]);

  const [imageLoaded, setImageLoaded] = useState(false);

  if (loading) {
    return <> </>
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className={`flex h-full w-full transition-opacity duration-500 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="m-auto flex h-[90%] w-[90%] flex-col overflow-y-auto rounded-lg bg-zinc-50 md:flex-row lg:flex-row">
        <Link href={item?.url} passHref legacyBehavior>
          <a
            target="_blank"
            className="mx-auto flex-col my-4 flex w-[90%] items-center justify-center md:w-1/2 lg:w-1/3"
          >
            <Image
              src={item?.url ?? ""} 
              width="0"
              height="0"
              sizes="100vw"
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              alt="item image"
              className="mt-5 h-auto w-full max-w-[500px] object-cover shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            />
            <p className="mr-max">Click here</p>
          </a>
        </Link>

        <FullItemText item={item} />
      </div>
    </div>
  );
}
