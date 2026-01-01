import type {
  Camera,
  Color,
  DirectionalLight,
  Vector3,
  Viewport,
} from "../core";
import type * as React from "react";

export type SkewedCameraProp = Camera;
export type SkewedViewportProp = Viewport;

export type SkewedCommonTransformProps = Partial<{
  id: string;
  position: Vector3;
  rotation: Vector3;
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
