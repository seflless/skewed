import { describe, expect, it } from "vitest";
import { Vector3 } from "./Vector3";

describe("Vector3", () => {
  it("Factory function variant should work", () => {
    expect(Vector3(1, 2, 3)).toEqual({ x: 1, y: 2, z: 3 });
    expect(Vector3([3, 4, 5])).toEqual({ x: 3, y: 4, z: 5 });
    expect(Vector3(6, 7, 8)).toEqual({ x: 6, y: 7, z: 8 });
  });

  it("Static Vector3s are set correctly", () => {
    expect(Vector3.Zero()).toEqual({ x: 0, y: 0, z: 0 });
    expect(Vector3.Up()).toEqual({ x: 0, y: 1, z: 0 });
    expect(Vector3.Down()).toEqual({ x: 0, y: -1, z: 0 });
    expect(Vector3.Left()).toEqual({ x: -1, y: 0, z: 0 });
    expect(Vector3.Right()).toEqual({ x: 1, y: 0, z: 0 });
    expect(Vector3.Forward()).toEqual({ x: 0, y: 0, z: -1 });
    expect(Vector3.Backward()).toEqual({ x: 0, y: 0, z: 1 });
  });

  it("Basic math operations and chaining works", () => {
    expect(Vector3(1, 2, 3).add(Vector3(4, 5, 6))).toEqual({
      x: 5,
      y: 7,
      z: 9,
    });
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
    expect(a.add(b).add(b).add(b)).toEqual({ x: 13, y: 17, z: 21 });
  });
});
