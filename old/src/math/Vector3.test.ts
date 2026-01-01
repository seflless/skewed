import { describe, expect, it } from "vitest";
import { Vector3 } from "./Vector3";

describe("Vector3", () => {
  it("Factory variants should work", () => {
    expect(Vector3()).toEqual(Vector3(0, 0, 0));
    expect(Vector3(1, 2, 3)).toEqual(Vector3(1, 2, 3));
    expect(Vector3([3, 4, 5])).toEqual(Vector3(3, 4, 5));
    expect(Vector3(6, 7, 8)).toEqual(Vector3(6, 7, 8));
  });

  it("Static Vector3s are set correctly", () => {
    // Use 3 param
    expect(Vector3.Zero()).toEqual(Vector3(0, 0, 0));
    expect(Vector3.Up()).toEqual(Vector3(0, 1, 0));
    expect(Vector3.Down()).toEqual(Vector3(0, -1, 0));
    expect(Vector3.Left()).toEqual(Vector3(-1, 0, 0));
    expect(Vector3.Right()).toEqual(Vector3(1, 0, 0));
    expect(Vector3.Forward()).toEqual(Vector3(0, 0, -1));
    expect(Vector3.Backward()).toEqual(Vector3(0, 0, 1));
  });

  it("Basic math operations", () => {
    expect(Vector3(1, 2, 3).add(Vector3(4, 5, 6))).toEqual(Vector3(5, 7, 9));
    expect(Vector3(10, 0, 0).normalize()).toEqual(Vector3(1, 0, 0));
    expect(Vector3(10, 2, 3).multiply(10)).toEqual(Vector3(100, 20, 30));
    expect(Vector3(1, 0, 0).dotProduct(Vector3(1, 0, 0))).toEqual(1);
  });

  it("Chaining style API supported", () => {
    const a = Vector3(1, 2, 3);
    const b = Vector3(4, 5, 6);

    // c should be a reference to a
    const c = a.add(Vector3.Zero());
    expect(a).toBe(c);

    // clone() should return a new object, with the same values
    const d = a.clone().add(Vector3.Zero());

    expect(a).not.toBe(d);

    expect(a).toEqual(d);

    // Mutations in place accumulate effects expected
    expect(a.add(b).add(b).add(b)).toEqual(Vector3(13, 17, 21));
  });
});
