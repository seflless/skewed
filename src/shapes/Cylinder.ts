import {
  BasicShapeProperties,
  DefaultBasicShapeProperties,
  DefaultShapeDimension,
  CylinderShape,
} from "./Shape";

export type CylinderProperties = {
  radius: number;
  height: number;
} & BasicShapeProperties;

function DefaultSphereProperties() {
  return {
    radius: DefaultShapeDimension / 2,
    height: DefaultShapeDimension,
    ...DefaultBasicShapeProperties(),
  };
}

export function Cylinder(props: Partial<CylinderProperties>): CylinderShape {
  const cylinder: CylinderShape = {
    type: "cylinder",
    ...DefaultSphereProperties(),
    ...props,
  };
  return cylinder;
}
