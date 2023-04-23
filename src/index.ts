export * from "./Box";

// main.ts
import { Vector3 } from "./Vector3";

const a = Vector3();

console.log(Vector3.isVector3("bob")); // fale
console.log(Vector3.isVector3(a)); // true
console.log(a);

// import { Vector3 } from "./Vector4";

// const a = Vector3();
// const randomVariable = "Not a Vector3";

// console.log(Vector3.isVector3(a)); // true
// console.log(Vector3.isVector3(randomVariable)); // false
