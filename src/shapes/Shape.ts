import { Mesh } from "../meshes/Mesh";
import { Vector3 } from "../math/Vector3";
import { Color } from "../colors/Color";

export type BasicShapeProperties = {
  position: Vector3;
  rotation: Vector3;
  scale: number;
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

export type Shape = MeshShape | SphereShape;
