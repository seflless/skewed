import {
  BasicShapeProperties,
  DefaultShapeDimension,
  DefaultBasicShapeProperties,
  Shape,
} from "./Shape";
import { CylinderMesh } from "../meshes/CylinderMesh";

export type CylinderProperties = {
  segments: number;
  radius: number;
  height: number;
};

const DefaultCylinderProperties: CylinderProperties & { id: string } = {
  segments: 32,
  radius: DefaultShapeDimension / 2,
  height: DefaultShapeDimension,
  id: "cylinder",
};

export function Cylinder(
  props: Partial<CylinderProperties & BasicShapeProperties>
): Shape {
  const meshParams: CylinderProperties = {
    segments: props.segments || DefaultCylinderProperties.segments,
    radius: props.radius || DefaultCylinderProperties.radius,
    height: props.height || DefaultCylinderProperties.height,
  };

  const cylinder: Shape = {
    type: "mesh",
    mesh: CylinderMesh(
      meshParams.radius,
      meshParams.height,
      meshParams.segments
    ),
    ...DefaultBasicShapeProperties(),
    id: props.id || DefaultCylinderProperties.id,
    ...props,
  };

  return cylinder;
}
