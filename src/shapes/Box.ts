import { BasicShapeProperties, Shape } from "./Shape";
import { BoxMesh } from "../meshes/BoxMesh";

export type BoxProps = {
  width: number;
  height: number;
  depth: number;
} & BasicShapeProperties;

export function Box(props: BoxProps): Shape {
  const box: Shape = {
    type: "mesh",
    mesh: BoxMesh(props.width, props.height, props.depth),
    position: props.position,
    fill: props.fill,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
  };

  return box;
}
