import { describe, it, expect, vi, beforeEach } from "vitest";

// Route-handler tests for GET /api/items/allitems.
// The data-access layer (`~/server/queries`) is mocked here on purpose: these
// tests cover HTTP status codes and response shapes only. Real PostgreSQL
// data-access coverage lives in tests/integration/.

const getItemsMock = vi.fn();
vi.mock("~/server/queries", () => ({
  getItems: (...args: unknown[]) => getItemsMock(...args),
}));

const { GET } = await import("~/app/api/items/allitems/route");

describe("route-handler: GET /api/items/allitems", () => {
  beforeEach(() => {
    getItemsMock.mockReset();
  });

  it("returns 200 with the list of items", async () => {
    const fakeItems = [
      {
        id: 1,
        name: "Vase",
        url: "https://utfs.io/x",
        price: "5.00",
        description: "A vase",
      },
    ];
    getItemsMock.mockResolvedValueOnce(fakeItems);

    const res = await GET();

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(fakeItems);
  });

  it("returns 200 with an empty array when the store is empty", async () => {
    // An empty store is a successful query yielding an empty set, not a
    // missing resource.
    getItemsMock.mockResolvedValueOnce([]);

    const res = await GET();

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual([]);
  });

  it("returns 500 when the query throws an Error", async () => {
    getItemsMock.mockRejectedValueOnce(new Error("boom"));

    const res = await GET();

    expect(res.status).toBe(500);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("boom");
  });
});
