import { Vector3 } from "./Vector3";

export type Face = {
  indices: number[];
  fill: string;
  stroke: string;
  normal: Vector3;
};

export type Mesh = {
  vertices: Vector3[];
  faces: Face[];
};
