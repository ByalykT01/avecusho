import { describe, it, expect } from "vitest";
import { cn } from "~/lib/utils";

describe("cn (class name helper)", () => {
  it("joins multiple class names with spaces", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false && "b", null, undefined, "c")).toBe("a c");
  });

  it("supports conditional class objects", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("merges conflicting tailwind utilities, keeping the last one", () => {
    // twMerge resolves conflicting Tailwind classes deterministically.
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });
});
