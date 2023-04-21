import { describe, expect, it } from "vitest";

// @ts-ignore
import { logSVG } from "./index";

describe("Export Tests", () => {
  it("logSVG is a function", () => {
    expect(typeof logSVG).toBe("function");
  });
});
