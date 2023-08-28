import { Color } from "../colors/Color";
import { Vector3 } from "../math/Vector3";

export type DirectionalLight = {
  type: "directional light";
  direction: Vector3;
  color: Color;
};

export type DirectionalLightProperties = Omit<DirectionalLight, "type">;

const DefaultDirectionalLightProperties = {
  direction: Vector3(0, -1, 0),
  color: Color(255, 255, 255),
};

export function DirectionalLight(
  props: Partial<DirectionalLightProperties>
): DirectionalLight {
  const light: DirectionalLight = {
    type: "directional light",
    ...DefaultDirectionalLightProperties,
    ...props,
  };
  return light;
}
