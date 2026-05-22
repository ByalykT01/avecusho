import { describe, it, expect } from "vitest";
import { LoginSchema, RegisterSchema } from "~/schemas";

describe("LoginSchema", () => {
  it("accepts a valid email and password", () => {
    const result = LoginSchema.safeParse({
      email: "user@example.com",
      password: "hunter2",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = LoginSchema.safeParse({
      email: "not-an-email",
      password: "hunter2",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = LoginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("RegisterSchema", () => {
  it("accepts a valid registration payload", () => {
    const result = RegisterSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a password shorter than 6 characters", () => {
    const result = RegisterSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "abc",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path.includes("password")),
      ).toBe(true);
    }
  });

  it("rejects an empty name", () => {
    const result = RegisterSchema.safeParse({
      name: "",
      email: "ada@example.com",
      password: "secret123",
    });
    expect(result.success).toBe(false);
  });
});
