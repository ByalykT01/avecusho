"use client";

import { useEffect, useState, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Item } from "~/lib/definitions";
import FullItemText from "./item-page-text";
import Spinner from "./spinner";

const LoadingSpinner = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Spinner/>
  </div>
);

// Separate error component
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex h-full w-full items-center justify-center">
    <p className="text-red-500 text-center rounded-lg bg-red-50 p-4">{message}</p>
  </div>
);

// Memoized image component to prevent unnecessary re-renders
const ItemImage = memo(({ url, onLoadComplete }: { url: string; onLoadComplete: () => void }) => (
  <Image
    src={url}
    width={0}
    height={0}
    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
    priority={true}
    onLoad={onLoadComplete}
    alt="Item image"
    className="mt-5 h-auto w-full max-w-[500px] object-cover shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
  />
));

ItemImage.displayName = 'ItemImage';

// Custom hook for fetching item data
const useItemData = (itemId: number) => {
  const [state, setState] = useState<{
    item: Item | null;
    loading: boolean;
    error: string | null;
  }>({
    item: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch("/api/items/oneitem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId }),
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const fetchedItem = (await res.json()) as Item;
        setState(prev => ({ ...prev, item: fetchedItem, loading: false }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "An unknown error occurred",
        }));
      }
    };

    void fetchItem();
  }, [itemId]);

  return state;
};

export default function FullItemImageView({ id }: { id: number }) {
  const { item, loading, error } = useItemData(id);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!item) return <ErrorMessage message="No item data found" />;

  return (
    <div
      className={`flex h-full w-full transition-opacity duration-500 ease-in-out ${
        imageLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="m-auto flex h-[90%] w-[90%] flex-col overflow-y-auto rounded-lg bg-zinc-50 md:flex-row lg:flex-row">
        <Link
          href={item.url}
          className="mx-auto flex-col my-4 flex w-[90%] items-center justify-center md:w-1/2 lg:w-1/3"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ItemImage url={item.url} onLoadComplete={handleImageLoad} />
          <p className="mt-2">Click here</p>
        </Link>
        <FullItemText item={item} />
      </div>
    </div>
  );
}