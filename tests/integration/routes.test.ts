// Integration tests for HTTP route handlers against real PostgreSQL.
// Unlike tests/routes/* (which mock ~/server/queries), these tests import
// the real handlers AND the real query layer, seeded via ./helpers.

import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

// Only the connection factory (~/server/db) is substituted: the app's pooled
// Neon driver cannot speak to plain PostgreSQL, so tests use a TCP client
// (./db-client) against the same schema. Route handlers and query functions
// run unmocked against real PostgreSQL.
vi.mock("~/server/db", async () => {
  const { testDb } = await import("./db-client");
  return { db: testDb };
});

afterAll(async () => {
  const { closeTestDb } = await import("./db-client");
  await closeTestDb();
});
import type { NextRequest } from "next/server";
import { seedItem, seedUser, truncateAll } from "./helpers";
import { POST as boughtItemsPOST } from "~/app/api/bought-items/route";
import { GET as allItemsGET } from "~/app/api/items/allitems/route";
import { updateItemOnPurchase } from "~/server/queries";

function postRequest(body: unknown): NextRequest {
  return new Request("http://localhost/api/under-test", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

beforeEach(async () => {
  await truncateAll();
});

describe("GET /api/items/allitems (real database)", () => {
  it("returns 200 with the seeded items", async () => {
    await seedItem({ name: "Vase" });

    const res = await allItemsGET();
    const body = (await res.json()) as Array<{ name: string }>;

    expect(res.status).toBe(200);
    expect(body.map((item) => item.name)).toContain("Vase");
  });

  it("returns 200 with an empty array when the store is empty", async () => {
    const res = await allItemsGET();

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual([]);
  });
});

describe("POST /api/bought-items (real database)", () => {
  it("returns 200 with only the buyer's items", async () => {
    const buyer = await seedUser();
    const other = await seedUser();
    const mine = await seedItem({ name: "Mine" });
    await seedItem({ name: "For sale" });
    await updateItemOnPurchase(mine, buyer);

    const res = await boughtItemsPOST(postRequest({ userId: buyer }));
    const body = (await res.json()) as Array<{
      id: number;
      userId: string;
    }>;

    expect(res.status).toBe(200);
    expect(body.map((item) => item.id)).toEqual([mine]);
    expect(body[0]?.userId).toBe(buyer);

    const empty = await boughtItemsPOST(postRequest({ userId: other }));
    await expect(empty.json()).resolves.toEqual([]);
  });

  it("returns 400 when userId is missing", async () => {
    const res = await boughtItemsPOST(postRequest({}));

    expect(res.status).toBe(400);
  });
});
