import type { Color, DirectionalLight } from "@skewed/core";
import type * as React from "react";

export type SkewedCameraProp = import("@skewed/core").Camera;
export type SkewedViewportProp = import("@skewed/core").Viewport;

export type SkewedCommonTransformProps = Partial<{
  id: string;
  position: import("@skewed/core").Vector3;
  rotation: import("@skewed/core").Vector3;
  scale: number;
}>;

export type SkewedCommonShapeProps = SkewedCommonTransformProps &
  Partial<{
    fill: Color;
    stroke: Color;
    strokeWidth: number;
  }>;

export type SkewedDirectionalLightProps = Partial<
  Omit<DirectionalLight, "type">
>;

export type SkewedAmbientLightProps = {
  color: Color;
};

export type SkewedRootProps = {
  camera?: SkewedCameraProp;
  viewport?: SkewedViewportProp;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

export type SkewedHtmlProps = SkewedCommonTransformProps & {
  id?: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
};


