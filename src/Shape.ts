import { type } from "os";
import { Mesh } from "./Mesh";
import { Vector3 } from "./Vector3";

export type Shape = {
  mesh: Mesh;
  position: Vector3;
};
