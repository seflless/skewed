export * from "./Box";
export * from "./Grid";
export * from "./Vector3";
export * from "./Mesh";
export * from "./Axii";

// main.ts
import { Vector3 } from "./Vector3";

const a = Vector3.Zero();

console.log(Vector3.isVector3("bob")); // fale
console.log(Vector3.isVector3(a)); // true
console.log(a);

const b = Vector3(1, 2, 3);
const c = Vector3([1, 2, 3]);
const d = Vector3({ x: 1, y: 2, z: 3 });

console.log("isVector3", Vector3.isVector3(d));

// console.log(a);
console.log(b);
console.log(c);
console.log(d);

// import { Vector3 } from "./Vector4";

// const a = Vector3();
// const randomVariable = "Not a Vector3";

// console.log(Vector3.isVector3(a)); // true
// console.log(Vector3.isVector3(randomVariable)); // false
