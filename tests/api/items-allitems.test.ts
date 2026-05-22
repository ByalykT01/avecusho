import { describe, it, expect, vi, beforeEach } from "vitest";

const getItemsMock = vi.fn();
vi.mock("~/server/queries", () => ({
  getItems: (...args: unknown[]) => getItemsMock(...args),
}));

const { GET } = await import("~/app/api/items/allitems/route");

describe("GET /api/items/allitems", () => {
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

  it("returns 404 when there are no items in the database", async () => {
    // The route treats a falsy value (undefined / null) from the query as a
    // missing-items condition.
    getItemsMock.mockResolvedValueOnce(undefined);

    const res = await GET();

    expect(res.status).toBe(404);
    const body = (await res.json()) as { message: string };
    expect(body.message).toMatch(/not found/i);
  });

  it("returns 500 when the query throws an Error", async () => {
    getItemsMock.mockRejectedValueOnce(new Error("boom"));

    const res = await GET();

    expect(res.status).toBe(500);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("boom");
  });
});
