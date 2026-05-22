import { describe, it, expect } from "vitest";
import { UploadItemSchema, UserDataSchema } from "~/schemas";

describe("UploadItemSchema", () => {
  it("accepts a well-formed item upload payload", () => {
    const parsed = UploadItemSchema.safeParse({
      name: "Painting",
      price: 19.99,
      description: "An original watercolour",
      url: "https://utfs.io/f/some-key",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a price with more than two decimal places", () => {
    const parsed = UploadItemSchema.safeParse({
      name: "Painting",
      price: 19.999,
      description: "An original watercolour",
      url: "https://utfs.io/f/some-key",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects a non-positive price", () => {
    const parsed = UploadItemSchema.safeParse({
      name: "Painting",
      price: -1,
      description: "An original watercolour",
      url: "https://utfs.io/f/some-key",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects a url that is not on the uploadthing CDN", () => {
    const parsed = UploadItemSchema.safeParse({
      name: "Painting",
      price: 5,
      description: "desc",
      url: "https://example.com/file.png",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("UserDataSchema", () => {
  it("normalises the email to lowercase", () => {
    const parsed = UserDataSchema.safeParse({
      name: "Alice",
      email: "ALICE@EXAMPLE.COM",
      phoneNumber: "123456789",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe("alice@example.com");
    }
  });

  it("rejects a name containing digits", () => {
    const parsed = UserDataSchema.safeParse({
      name: "Alice2",
      email: "alice@example.com",
      phoneNumber: "123456789",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects a phone number that is too short", () => {
    const parsed = UserDataSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      phoneNumber: "1234",
    });
    expect(parsed.success).toBe(false);
  });
});
