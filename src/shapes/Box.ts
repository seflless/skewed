import { Shape } from "./Shape";
import { Vector3 } from "../Vector3";
import { BoxMesh } from "../meshes/BoxMesh";
import { Color } from "../colors/Color";

export function Box(position: Vector3, fill: Color): Shape {
  return {
    mesh: BoxMesh,
    position,
    fill,
  } as Shape;
}
