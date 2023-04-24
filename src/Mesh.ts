import { Vector3 } from "./Vector3";

export type Face = {
  indices: number[];
};

export type Mesh = {
  vertices: Vector3[];
  faces: Face[];
};
