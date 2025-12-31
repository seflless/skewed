import { Color } from "../colors/Color";
import { DirectionalLight } from "../lighting/DirectionalLight";
import { Shape } from "../shapes/Shape";

export type Scene = {
  directionalLight: DirectionalLight;
  ambientLightColor: Color;
  shapes: Shape[];
};
