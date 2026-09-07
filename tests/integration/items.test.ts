// Integration tests for item queries against real PostgreSQL.
// Exercises: createNewItem, getItems, getOneItem.

import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

// Only the connection factory (~/server/db) is substituted: the app's pooled
// Neon driver cannot speak to plain PostgreSQL, so tests use a TCP client
// (./db-client) against the same schema. Every query function under test runs
// unmocked against real PostgreSQL.
vi.mock("~/server/db", async () => {
  const { testDb } = await import("./db-client");
  return { db: testDb };
});

afterAll(async () => {
  const { closeTestDb } = await import("./db-client");
  await closeTestDb();
});
import { seedItem, truncateAll } from "./helpers";
import {
  createNewItem,
  getItems,
  getOneItem,
} from "~/server/queries";

beforeEach(async () => {
  await truncateAll();
});

describe("getItems", () => {
  it("returns an empty array when the store has no items", async () => {
    await expect(getItems()).resolves.toEqual([]);
  });

  it("returns items ordered by id descending", async () => {
    const first = await seedItem({ name: "First" });
    const second = await seedItem({ name: "Second" });

    const found = await getItems();

    expect(found.map((item) => item.id)).toEqual([second, first]);
  });
});

describe("createNewItem / getOneItem", () => {
  it("persists a new item and reads it back by id", async () => {
    const inserted = await createNewItem({
      name: "Watercolour",
      url: "https://utfs.io/f/some-key",
      price: 19.99,
      description: "An original watercolour",
    });
    const insertedId = inserted[0]?.insertedId;
    expect(insertedId).toEqual(expect.any(Number));

    const found = await getOneItem(insertedId as number);

    expect(found).toMatchObject({
      name: "Watercolour",
      price: "19.99",
      description: "An original watercolour",
    });
  });

  it("throws when the item does not exist", async () => {
    await expect(getOneItem(999_999)).rejects.toThrow("Item not found");
  });
});
