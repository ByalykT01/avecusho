// Shared helpers for the integration test suite (real PostgreSQL).
//
// All helpers go through the app's real database client (~/server/db), so
// seeding exercises the same driver stack as the queries under test.

import { sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "~/server/db";
import { items, users } from "~/server/db/schema";

export function uniqueEmail(prefix = "test"): string {
  return `${prefix}-${randomUUID()}@example.com`;
}

/** Remove all rows from every table the suite touches. */
export async function truncateAll(): Promise<void> {
  await db.execute(
    sql`TRUNCATE "user", aurora_item, aurora_cart, aurora_cart_item, aurora_user_data, "aurora_verificationToken" RESTART IDENTITY CASCADE`,
  );
}

export async function seedUser(
  overrides: Partial<typeof users.$inferInsert> = {},
): Promise<string> {
  const id = randomUUID();
  await db.insert(users).values({
    id,
    name: "Test User",
    email: uniqueEmail(),
    password: "hashed-password",
    ...overrides,
  });
  return id;
}

export async function seedItem(
  overrides: Partial<typeof items.$inferInsert> = {},
): Promise<number> {
  const rows = await db
    .insert(items)
    .values({
      name: "Test item",
      url: "https://utfs.io/f/test-key",
      price: "12.50",
      description: "A test item",
      ...overrides,
    })
    .returning({ id: items.id });
  const row = rows[0];
  if (!row) {
    throw new Error("seedItem: insert returned no rows");
  }
  return row.id;
}
