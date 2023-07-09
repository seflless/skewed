import { Vector3 } from "../math/Vector3";

export type Face = {
  indices: number[];
  normal: Vector3;
};

export type Mesh = {
  vertices: Vector3[];
  faces: Face[];
};
