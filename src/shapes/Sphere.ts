import {
  BasicShapeProperties,
  DefaultBasicShapeProperties,
  DefaultShapeDimension,
  SphereShape,
} from "./Shape";

export type SphereProperties = {
  radius: number;
} & BasicShapeProperties;

const DefaultSphereProperties: SphereProperties = {
  radius: DefaultShapeDimension / 2,
  ...DefaultBasicShapeProperties,
};

export function Sphere(props: Partial<SphereProperties>): SphereShape {
  const sphere: SphereShape = {
    type: "sphere",
    ...DefaultSphereProperties,
    ...props,
  };
  return sphere;
}
