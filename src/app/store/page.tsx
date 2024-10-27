"use client";

import ItemCard from "~/components/item-card";
import { useCallback, useEffect, useState } from "react";
import type { Item } from "~/lib/definitions";

export const dynamic = "force-dynamic";

export default function StorePage() {
  const [items, setItems] = useState<Item[]>([]);
  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/items/allitems");
      return (await response.json()) as Item[];
    } catch (e) {
      console.error(e);
      return [];
    }
  }, []);

  useEffect(() => {
    const initializeStore = async () => {
      const fetchedItems = await fetchItems();
      setItems(fetchedItems);
    };

    void initializeStore();
  }, [fetchItems]);

  const filteredItems = items.filter((item) => item.userId === null);

  return (
    <main className="mx-auto sm:mx-auto md:px-5 lg:px-10">
      <div className="grid grid-cols-1 gap-5 sm:mx-auto sm:grid-cols-1 sm:gap-5 md:grid-cols-3 md:gap-4 lg:grid-cols-5 lg:gap-8">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
