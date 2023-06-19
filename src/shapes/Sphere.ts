import { Shape } from "./Shape";
import { Vector3 } from "../Vector3";
import { Color } from "../colors/Color";

export function Sphere(position: Vector3, radius: number, fill: Color): Shape {
  return {
    type: "sphere",
    radius,
    position,
    fill,
  } as Shape;
}
