export interface Vector3 {
  x: number;
  y: number;
  z: number;
  set: (vec: Vector3) => Vector3;
  add: (vec: Vector3) => Vector3;
  subtract: (vec: Vector3) => Vector3;
  multiply: (scalar: number) => Vector3;
  clone: () => Vector3;
  normalize: () => Vector3;
  length: () => number;
  dotProduct: (vec: Vector3) => number;
}

// Actual implementation of Vector3, we take this approach we because we want a
// 'new' free API. Ie: `v = Vector3()` instead of `v = new Vector3()`.
// This is based on a conversation with GPT-4 that helped meet my requirements
// https://chat.openai.com/c/f22bc4d6-2cc3-44c1-8b91-28c2708f2c17
const Vector3Proto = {
  set(this: Vector3, vec: Vector3): Vector3 {
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
    return this;
  },

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

  subtract(this: Vector3, vec: Vector3): Vector3 {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
    return this;
  },

  multiply(this: Vector3, scalar: number): Vector3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  },

  clone(this: Vector3): Vector3 {
    return createVector3(this.x, this.y, this.z);
  },

  normalize(this: Vector3): Vector3 {
    let length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    // Prevent divide by zero
    if (length === 0) {
      // A bit of a magic number, should think about this some more.
      length = 0.0000001;
    }

    this.x /= length;
    this.y /= length;
    this.z /= length;
    return this;
  },

  length(this: Vector3): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  },

  dotProduct(this: Vector3, vec: Vector3): number {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  },
};

function createVector3(x: number, y: number, z: number): Vector3 {
  return Object.assign(Object.create(Vector3Proto), { x, y, z });
}

/**
 * Creates a new Vector3 instance with the specified x, y, and z coordinates.
 *
 * @param x - The x-coordinate of the new Vector3 instance
 * @param y - The y-coordinate of the new Vector3 instance
 * @param z - The z-coordinate of the new Vector3 instance
 * @returns A Vector3 instance with the specified x, y, and z coordinates
 */
export function Vector3(x: number, y: number, z: number): Vector3;

/**
 * Creates a new Vector3 instance with the specified coordinates from an object.
 *
 * @param coords - An object containing x, y, and z coordinates for the new Vector3 instance
 * @returns A Vector3 instance with the specified x, y, and z coordinates
 */
export function Vector3(coords: { x: number; y: number; z: number }): Vector3;

// /**
//  * Creates a new Vector3 instance. The function supports various input formats for convenient instantiation.
//  *
//  * @returns A Vector3 instance initialized to (0, 0, 0) when called without arguments
//  */
// export function Vector3(): Vector3;

/**
 * Creates a new Vector3 instance with the specified coordinates from an array.
 *
 * @param coords - An array containing x, y, and z coordinates for the new Vector3 instance
 * @returns A Vector3 instance with the specified x, y, and z coordinates
 */
export function Vector3(coords: [number, number, number]): Vector3;

/**
 * The implementation of the overloaded Vector3 factory function.
 *
 * @param x - The x-coordinate, an object containing x, y, and z coordinates, or an array containing x, y, and z coordinates
 * @param y - The y-coordinate (optional)
 * @param z - The z-coordinate (optional)
 * @returns A Vector3 instance with the specified x, y, and z coordinates, or initialized to (0, 0, 0) when called without arguments
 */
export function Vector3(
  x?: number | { x: number; y: number; z: number } | [number, number, number],
  y?: number,
  z?: number
): Vector3 {
  if (typeof x === "object") {
    if (Array.isArray(x)) {
      return createVector3(x[0], x[1], x[2]);
    } else {
      return createVector3(x.x, x.y, x.z);
    }
  } else if (
    typeof x === "number" &&
    typeof y === "number" &&
    typeof z === "number"
  ) {
    return createVector3(x, y, z);
  }
  {
    throw new Error("Invalid arguments to Vector3 factory");
  }
}

/***************************************************************
Add all statics here, and in this style. 

Note: I don't understand from a Typescript perspective
how this works such that Vector3 now has static functions, but it
does work. Also based on a GPT-4 conversation.
https://chat.openai.com/c/f22bc4d6-2cc3-44c1-8b91-28c2708f2c17

****************************************************************/

/**
 * Determines if the input value is an instance of Vector3.
 *
 * @param value - The variable to check if it is an instance of Vector3
 * @returns A boolean value indicating whether the input value is a Vector3 instance
 */
Vector3.isVector3 = function (value: any): value is Vector3 {
  return value.constructor === Vector3Proto.constructor;
};

Vector3.Zero = function (): Vector3 {
  return Vector3(0, 0, 0);
};

Vector3.Up = function (): Vector3 {
  return Vector3(0, 1, 0);
};

Vector3.Down = function (): Vector3 {
  return Vector3(0, -1, 0);
};

Vector3.Left = function (): Vector3 {
  return Vector3(-1, 0, 0);
};

Vector3.Right = function (): Vector3 {
  return Vector3(1, 0, 0);
};

Vector3.Forward = function (): Vector3 {
  return Vector3(0, 0, -1);
};

Vector3.Backward = function (): Vector3 {
  return Vector3(0, 0, 1);
};
