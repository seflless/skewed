import { Shape } from "./Shape";
import { Vector3 } from "../Vector3";
import { BoxMesh } from "../meshes/BoxMesh";
import { Color } from "../colors/Color";

export type BoxProps = {
  position: Vector3;
  fill: Color;
  width: number;
  height: number;
  depth: number;
};

export function Box(props: BoxProps): Shape {
  return {
    type: "mesh",
    mesh: BoxMesh(props.width, props.height, props.depth),
    position: props.position,
    fill: props.fill,
  } as Shape;
}
