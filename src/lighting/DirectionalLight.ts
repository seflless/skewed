import { Color } from "../colors/Color";
import { Vector3 } from "../math/Vector3";

export type DirectionalLight = {
  type: "directional light";
  direction: Vector3;
  color: Color;
};
