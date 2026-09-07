// Integration tests for user queries against real PostgreSQL.
// Exercises: saltAndHashPassword, comparePasswords, getUserFromDb,
// getUserByEmail, getUserById, getUserWithDetails, upsertUser, updateUser,
// and the verification-token queries.

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
import { seedUser, truncateAll, uniqueEmail } from "./helpers";
import {
  comparePasswords,
  getUserByEmail,
  getUserById,
  getUserFromDb,
  getUserWithDetails,
  saltAndHashPassword,
  updateUser,
  upsertUser,
} from "~/server/queries";
import {
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
} from "~/server/queries/verification-tokens";
import { generateVerificationToken } from "~/lib/tokens";

beforeEach(async () => {
  await truncateAll();
});

describe("password helpers", () => {
  it("hashes a password and verifies it", async () => {
    const hash = await saltAndHashPassword("secret123");

    expect(hash).not.toBe("secret123");
    await expect(comparePasswords("secret123", hash)).resolves.toBe(true);
    await expect(comparePasswords("wrong", hash)).resolves.toBe(false);
    await expect(comparePasswords(null, hash)).resolves.toBe(false);
  });
});

describe("getUserFromDb", () => {
  it("returns the user when the password matches", async () => {
    const email = uniqueEmail();
    const hash = await saltAndHashPassword("secret123");
    await seedUser({ email, password: hash });

    const found = await getUserFromDb(email, "secret123");

    expect(found).toMatchObject({ email });
  });

  it("returns null for a wrong password or unknown email", async () => {
    const email = uniqueEmail();
    const hash = await saltAndHashPassword("secret123");
    await seedUser({ email, password: hash });

    await expect(getUserFromDb(email, "nope")).resolves.toBeNull();
    await expect(
      getUserFromDb(uniqueEmail("unknown"), "secret123"),
    ).resolves.toBeNull();
  });
});

describe("user lookups", () => {
  it("finds users by email and by id", async () => {
    const email = uniqueEmail();
    const id = await seedUser({ email, name: "Ada" });

    await expect(getUserByEmail(email)).resolves.toMatchObject({ id, email });
    await expect(getUserByEmail(uniqueEmail("missing"))).resolves.toBeUndefined();
    await expect(getUserById(id)).resolves.toMatchObject({ id, email });
  });

  it("returns the user joined with their additional details", async () => {
    const id = await seedUser({ name: "Ada" });
    await upsertUser({
      userId: id,
      name: "Ada",
      email: "ada@example.com",
      phoneNumber: "123456789",
      city: "Paris",
    });

    const details = await getUserWithDetails(id);

    expect(details).toMatchObject({
      id,
      city: "Paris",
      phoneNumber: "123456789",
    });
  });

  it("returns null details for an unknown user", async () => {
    await expect(
      getUserWithDetails("00000000-0000-4000-8000-000000000000"),
    ).resolves.toBeNull();
  });
});

describe("upsertUser / updateUser", () => {
  it("inserts user_data on first call and updates it afterwards", async () => {
    const id = await seedUser();

    await upsertUser({
      userId: id,
      name: "Ada Updated",
      email: "ada@example.com",
      phoneNumber: "123456789",
      city: "Paris",
    });
    await expect(getUserWithDetails(id)).resolves.toMatchObject({
      name: "Ada Updated",
      city: "Paris",
    });

    await upsertUser({
      userId: id,
      name: "Ada Updated",
      email: "ada@example.com",
      phoneNumber: "987654321",
      city: "Lyon",
    });
    await expect(getUserWithDetails(id)).resolves.toMatchObject({
      city: "Lyon",
      phoneNumber: "987654321",
    });
  });

  it("propagates database errors instead of swallowing them", async () => {
    await expect(
      upsertUser({
        // Violates the users.id foreign key: no such user exists.
        userId: "00000000-0000-4000-8000-000000000000",
        name: "Ghost",
        email: uniqueEmail("ghost"),
        phoneNumber: "123456789",
      }),
    ).rejects.toThrow();
  });

  it("updateUser persists profile changes", async () => {
    const id = await seedUser({ name: "Before" });
    const current = await getUserById(id);

    await updateUser({ ...current, name: "After" });

    await expect(getUserById(id)).resolves.toMatchObject({ name: "After" });
  });
});

describe("verification tokens", () => {
  it("generates a token and looks it up by email and by token", async () => {
    const email = uniqueEmail();

    await generateVerificationToken(email);

    const byEmail = await getVerificationTokenByEmail(email);
    expect(byEmail).toMatchObject({ email });
    const byToken = await getVerificationTokenByToken(byEmail?.token ?? "");
    expect(byToken).toMatchObject({ email });

    await expect(
      getVerificationTokenByEmail(uniqueEmail("missing")),
    ).resolves.toBeUndefined();
    await expect(
      getVerificationTokenByToken("no-such-token"),
    ).resolves.toBeUndefined();
  });

  it("replaces the previous token for the same email", async () => {
    const email = uniqueEmail();

    await generateVerificationToken(email);
    const first = await getVerificationTokenByEmail(email);
    await generateVerificationToken(email);
    const second = await getVerificationTokenByEmail(email);

    expect(second?.token).not.toBe(first?.token);
  });
});
