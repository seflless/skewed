import { BasicShapeProperties, Shape } from "./Shape";

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
