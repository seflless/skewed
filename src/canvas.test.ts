import { describe, expect, it } from "vitest";

// @ts-ignore
import { logCanvas } from "./index";

describe("Export Tests", () => {
  it("logCanvas is a function", () => {
    expect(typeof logCanvas).toBe("function");
  });
});
