import { BasicShapeProperties, Shape } from "./Shape";
import { Vector3 } from "../math/Vector3";
import { Color } from "../colors/Color";

export type SphereProps = {
  radius: number;
} & BasicShapeProperties;

export function Sphere(props: SphereProps): Shape {
  const sphere: Shape = {
    type: "sphere",
    radius: props.radius,
    position: props.position,
    fill: props.fill,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
  };
  return sphere;
}
