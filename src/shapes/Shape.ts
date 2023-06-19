import { type } from "os";
import { Mesh } from "../meshes/Mesh";
import { Vector3 } from "../Vector3";
import { Color } from "../colors/Color";

export type Shape = {
  mesh: Mesh;
  position: Vector3;
  fill: Color;
};
