import { Shape } from "./Shape";
import { Vector3 } from "../Vector3";
import { CylinderMesh } from "../meshes/CylinderMesh";
import { Color } from "../colors/Color";

export function Cylinder(position: Vector3, fill: Color): Shape {
  return {
    mesh: CylinderMesh,
    position,
    fill,
  } as Shape;
}
