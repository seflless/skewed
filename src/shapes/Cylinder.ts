import { Shape } from "./Shape";
import { Vector3 } from "../Vector3";
import { CylinderMesh } from "../meshes/CylinderMesh";
import { Color } from "../colors/Color";

export type CylinderProps = {
  position: Vector3;
  segments: number;
  radius: number;
  height: number;
  fill: Color;
};

export function Cylinder(props: CylinderProps): Shape {
  const cylinder: Shape = {
    type: "mesh",
    mesh: CylinderMesh(props.radius, props.height, props.segments),
    position: props.position,
    fill: props.fill,
  };

  return cylinder;
}
