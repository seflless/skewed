import { Mesh } from "../meshes/Mesh";
import { Vector3 } from "../math/Vector3";
import { Color } from "../colors/Color";

export type BasicShapeProperties = {
  position: Vector3;
  fill: Color;
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
