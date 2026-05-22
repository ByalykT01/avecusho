import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the queries module BEFORE importing the route under test so the route's
// `import { getBoughtItems } from "~/server/queries"` picks up our stub instead
// of pulling in drizzle + the real Postgres client.
const getBoughtItemsMock = vi.fn();
vi.mock("~/server/queries", () => ({
  getBoughtItems: (...args: unknown[]) => getBoughtItemsMock(...args),
}));

// Import the route handler after the mock is registered.
const { POST } = await import("~/app/api/bought-items/route");

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/bought-items", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;
}

describe("POST /api/bought-items", () => {
  beforeEach(() => {
    getBoughtItemsMock.mockReset();
  });

  it("returns 200 with the items belonging to the user", async () => {
    const fakeItems = [
      { id: 1, name: "A", price: "10.00", userId: "user-1" },
      { id: 2, name: "B", price: "20.00", userId: "user-1" },
    ];
    getBoughtItemsMock.mockResolvedValueOnce(fakeItems);

    const res = await POST(makeRequest({ userId: "user-1" }));

    expect(res.status).toBe(200);
    expect(getBoughtItemsMock).toHaveBeenCalledWith("user-1");
    await expect(res.json()).resolves.toEqual(fakeItems);
  });

  it("returns 200 with an empty array when the user has no purchases", async () => {
    getBoughtItemsMock.mockResolvedValueOnce([]);

    const res = await POST(makeRequest({ userId: "user-2" }));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual([]);
  });

  it("returns 500 when the underlying query throws", async () => {
    getBoughtItemsMock.mockRejectedValueOnce(new Error("db down"));

    const res = await POST(makeRequest({ userId: "user-3" }));

    expect(res.status).toBe(500);
    const body = (await res.json()) as { error: unknown };
    expect(body.error).toBeDefined();
  });
});
