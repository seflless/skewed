import * as React from "react";
import { TYPE_AMBIENT_LIGHT, TYPE_DIRECTIONAL_LIGHT } from "./intrinsics";
import type {
  SkewedAmbientLightProps,
  SkewedDirectionalLightProps,
} from "./types";

export function DirectionalLight(props: SkewedDirectionalLightProps) {
  return React.createElement(TYPE_DIRECTIONAL_LIGHT, props);
}

export function AmbientLight(props: SkewedAmbientLightProps) {
  return React.createElement(TYPE_AMBIENT_LIGHT, props);
}
