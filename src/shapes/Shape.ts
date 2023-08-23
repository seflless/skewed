import { Mesh } from "../meshes/Mesh";
import { Vector3 } from "../math/Vector3";
import { Color } from "../colors/Color";

export type TransformProperties = {
  position: Vector3;
  rotation: Vector3;
  scale: number;
};

export type BasicShapeProperties = TransformProperties & {
  fill: Color;
  stroke: Color;
  strokeWidth: number;
};

export type MeshShape = {
  type: "mesh";
  mesh: Mesh;
} & BasicShapeProperties;

export type SphereShape = {
  type: "sphere";
  radius: number;
} & BasicShapeProperties;

export type GroupShape = TransformProperties & {
  type: "group";
  children: Shape[];
};

export type Shape = MeshShape | SphereShape | GroupShape;
