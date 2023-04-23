export interface Vector3 {
  x: number;
  y: number;
  z: number;
  add: (vec: Vector3) => Vector3;
}

// Actual implementation of Vector3, we take this approach we becasuse we want a
// 'new' free API. Ie: `v = Vector3()` instead of `v = new Vector3()`.
// This is based on a conversation with GPT-4 that helped meet my requirements
// https://chat.openai.com/c/f22bc4d6-2cc3-44c1-8b91-28c2708f2c17
const Vector3Proto = {
  /**
   * Adds a vector to this vector, mutating it in place. It
   * returns this vector, so that API chaining is possible (ie: `v.add(v2).add(v3)`)
   *
   * @param vec - The vector to add to this vector.
   * @returns Vector3
   */
  add(this: Vector3, vec: Vector3): Vector3 {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
  },

  clone(this: Vector3): Vector3 {
    return create(this.x, this.y, this.z);
  },
};

function create(x: number, y: number, z: number): Vector3 {
  return Object.assign(Object.create(Vector3Proto), { x, y, z });
}

export function Vector3(): Vector3;
export function Vector3(x: number, y: number, z: number): Vector3;
export function Vector3(coords: { x: number; y: number; z: number }): Vector3;
export function Vector3(coords: [number, number, number]): Vector3;
export function Vector3(
  x?: number | { x: number; y: number; z: number } | [number, number, number],
  y?: number,
  z?: number
): Vector3 {
  if (typeof x === "object") {
    if (Array.isArray(x)) {
      return create(x[0], x[1], x[2]);
    } else {
      return create(x.x, x.y, x.z);
    }
  } else if (
    typeof x === "number" &&
    typeof y === "number" &&
    typeof z === "number"
  ) {
    return create(x, y, z);
  } else {
    return create(0, 0, 0);
  }
}

// Add statics here. I don't understand from a Typescript perspective
// how this works such that Vector3 now has static functions, but it
// does work. Also based on a GPT-4 conversation.
// https://chat.openai.com/c/f22bc4d6-2cc3-44c1-8b91-28c2708f2c17

Vector3.isVector3 = function (value: any): value is Vector3 {
  return value.prototype === Vector3Proto;
};
