// Integration tests for purchase queries against real PostgreSQL.
// Exercises: updateItemOnPurchase, getBoughtItems.

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
import { seedItem, seedUser, truncateAll } from "./helpers";
import { getBoughtItems, updateItemOnPurchase } from "~/server/queries";

beforeEach(async () => {
  await truncateAll();
});

describe("updateItemOnPurchase", () => {
  it("assigns the item to the buying user", async () => {
    const userId = await seedUser();
    const itemId = await seedItem();

    const updated = await updateItemOnPurchase(itemId, userId);

    expect(updated).toEqual({
      success: true,
      data: [expect.objectContaining({ id: itemId, userId })],
    });
  });

  it("returns { success: false } when the item does not exist", async () => {
    const userId = await seedUser();

    await expect(updateItemOnPurchase(999_999, userId)).resolves.toEqual({
      success: false,
      error: "NOT_FOUND",
    });
  });
});

describe("getBoughtItems", () => {
  it("returns only the items owned by the given user", async () => {
    const buyer = await seedUser();
    const stranger = await seedUser();
    const boughtA = await seedItem({ name: "Bought A" });
    const boughtB = await seedItem({ name: "Bought B" });
    await seedItem({ name: "Still for sale" });
    await updateItemOnPurchase(boughtA, buyer);
    await updateItemOnPurchase(boughtB, buyer);

    const found = await getBoughtItems(buyer);

    expect(found.map((item) => item.id).sort()).toEqual(
      [boughtA, boughtB].sort(),
    );
    for (const item of found) {
      expect(item.userId).toBe(buyer);
    }
    await expect(getBoughtItems(stranger)).resolves.toEqual([]);
  });

  it("returns an empty array for a user with no purchases", async () => {
    const userId = await seedUser();
    await seedItem();

    await expect(getBoughtItems(userId)).resolves.toEqual([]);
  });
});
