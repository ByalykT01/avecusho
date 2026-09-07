// Integration tests for cart queries against real PostgreSQL.
// Exercises: addItemToCart, getCartByUserId, getCartItems, findItemFromCart,
// deleteItemFromCart.

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
import {
  addItemToCart,
  deleteItemFromCart,
  findItemFromCart,
  getCartByUserId,
  getCartItems,
} from "~/server/queries";

beforeEach(async () => {
  await truncateAll();
});

describe("addItemToCart / getCartItems", () => {
  it("creates a cart on first add and returns its items", async () => {
    const userId = await seedUser();
    const itemId = await seedItem();

    await expect(getCartByUserId(userId)).resolves.toBeUndefined();
    await expect(getCartItems(userId)).resolves.toBeNull();

    const result = await addItemToCart(itemId, userId);

    expect(result).toMatchObject({ itemId });
    expect(result.cartId).toEqual(expect.any(Number));

    const cartItems = await getCartItems(userId);
    expect(cartItems).toHaveLength(1);
    expect(cartItems?.[0]).toMatchObject({
      cartId: result.cartId,
      itemId,
    });
  });

  it("rejects adding the same item twice", async () => {
    const userId = await seedUser();
    const itemId = await seedItem();
    await addItemToCart(itemId, userId);

    await expect(addItemToCart(itemId, userId)).rejects.toThrow(
      "already in the cart",
    );
    await expect(getCartItems(userId)).resolves.toHaveLength(1);
  });

  it("throws when the item does not exist", async () => {
    const userId = await seedUser();

    await expect(addItemToCart(999_999, userId)).rejects.toThrow(
      "Item not found",
    );
  });
});

describe("findItemFromCart", () => {
  it("finds an item present in the cart and returns null otherwise", async () => {
    const userId = await seedUser();
    const inCart = await seedItem({ name: "In cart" });
    const notInCart = await seedItem({ name: "Not in cart" });
    await addItemToCart(inCart, userId);

    const found = await findItemFromCart(inCart, userId);
    expect(found).toMatchObject({ itemId: inCart });

    await expect(findItemFromCart(notInCart, userId)).resolves.toBeNull();
  });

  it("throws when the user has no cart", async () => {
    const userId = await seedUser();
    const itemId = await seedItem();

    await expect(findItemFromCart(itemId, userId)).rejects.toThrow(
      "No cart found",
    );
  });
});

describe("deleteItemFromCart", () => {
  it("removes the item from the cart", async () => {
    const userId = await seedUser();
    const itemId = await seedItem();
    await addItemToCart(itemId, userId);

    const deleted = await deleteItemFromCart(itemId, userId);

    expect(deleted).toEqual([{ itemId }]);
    await expect(getCartItems(userId)).resolves.toEqual([]);
  });

  it("throws when the user has no cart", async () => {
    const userId = await seedUser();

    await expect(deleteItemFromCart(1, userId)).rejects.toThrow(
      "User has no cart",
    );
  });
});
