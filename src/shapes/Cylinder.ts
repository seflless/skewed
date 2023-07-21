import { BasicShapeProperties, Shape } from "./Shape";
import { Vector3 } from "../math/Vector3";
import { CylinderMesh } from "../meshes/CylinderMesh";
import { Color } from "../colors/Color";

export type CylinderProps = {
  segments: number;
  radius: number;
  height: number;
} & BasicShapeProperties;

export function Cylinder(props: CylinderProps): Shape {
  const cylinder: Shape = {
    type: "mesh",
    mesh: CylinderMesh(props.radius, props.height, props.segments),
    position: props.position,
    fill: props.fill,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
  };

  return cylinder;
}
