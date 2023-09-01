import { Mesh } from "../meshes/Mesh";
import { Vector3 } from "../math/Vector3";
import { Color } from "../colors/Color";

export type TransformProperties = {
  position: Vector3;
  rotation: Vector3;
  scale: number;
};

export const DefaultTransformProperties = (): TransformProperties => ({
  position: Vector3(0, 0, 0),
  rotation: Vector3(0, 0, 0),
  scale: 1,
});

export type BasicShapeProperties = TransformProperties & {
  fill: Color;
  stroke: Color;
  strokeWidth: number;
  id: string;
};

export const DefaultBasicShapeProperties = (): BasicShapeProperties => ({
  ...DefaultTransformProperties(),
  fill: Color(128, 128, 128),
  stroke: Color(0, 0, 0),
  strokeWidth: 1,
  id: "",
});

export const DefaultShapeDimension = 100;

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
  id: string;
  children: Shape[];
};

export type GridShape = BasicShapeProperties & {
  type: "grid";
  id: string;
  children: Shape[];
  cellCount: number;
  cellSize: number;
};

export type Shape = MeshShape | SphereShape | GroupShape | GridShape;
