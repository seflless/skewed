import * as React from "react";
import {
  Blue,
  Color as CoreColor,
  DefaultShapeDimension,
  Green,
  Red,
  Vector3,
} from "../core";
import type { Color as CoreColorType, Mesh } from "../core";
import {
  TYPE_BOX,
  TYPE_CYLINDER,
  TYPE_GRID,
  TYPE_GROUP,
  TYPE_MESH,
  TYPE_SPHERE,
  TYPE_TEXT,
} from "./intrinsics";
import type { SkewedCommonShapeProps, SkewedCommonTransformProps } from "./types";

export type BoxProps = SkewedCommonShapeProps &
  Partial<{
    width: number;
    height: number;
    depth: number;
  }>;
export function Box(props: BoxProps) {
  return React.createElement(TYPE_BOX, props);
}

export type SphereProps = SkewedCommonShapeProps & Partial<{ radius: number }>;
export function Sphere(props: SphereProps) {
  return React.createElement(TYPE_SPHERE, props);
}

export type CylinderProps = SkewedCommonShapeProps &
  Partial<{ radius: number; height: number }>;
export function Cylinder(props: CylinderProps) {
  return React.createElement(TYPE_CYLINDER, props);
}

export type TextProps = SkewedCommonShapeProps &
  Partial<{ text: string; fontSize: number; fontFamily: string }>;
export function Text(props: TextProps) {
  return React.createElement(TYPE_TEXT, props);
}

export type GroupProps = SkewedCommonTransformProps &
  Partial<{ id: string; children: React.ReactNode }>;
export function Group(props: GroupProps) {
  const { children, ...rest } = props;
  return React.createElement(TYPE_GROUP, rest, children);
}

export type GridProps = SkewedCommonShapeProps &
  Partial<{ cellCount: number; cellSize: number }>;
export function Grid(props: GridProps) {
  return React.createElement(TYPE_GRID, props);
}

export type MeshProps = SkewedCommonShapeProps & Partial<{ mesh: Mesh }>;
export function Mesh(props: MeshProps) {
  return React.createElement(TYPE_MESH, props);
}

export type AxiiProps = SkewedCommonTransformProps &
  Partial<{
    stroke: CoreColorType;
    strokeWidth: number;
  }>;

/**
 * Axii helper (3 colored axes + a small black origin cube).
 *
 * Implemented as composition of primitives so we don't need a special reconciler intrinsic.
 */
export function Axii(props: AxiiProps) {
  const { id = "axii", position, rotation, scale, stroke, strokeWidth } =
    (props ?? {}) as AxiiProps;
  const L = DefaultShapeDimension;
  const t = DefaultShapeDimension / 10;
  const s = stroke ?? CoreColor(0, 0, 0);
  const sw = strokeWidth ?? 0.5;

  // Avoid passing `position/rotation/scale: undefined` through to core shape factories:
  // they spread props over defaults, and `undefined` would override the defaults.
  const groupProps: any = { id };
  if (position) groupProps.position = position;
  if (rotation) groupProps.rotation = rotation;
  if (typeof scale === "number") groupProps.scale = scale;

  return React.createElement(
    Group,
    groupProps,
    React.createElement(Box, {
      id: `${id}-origin`,
      width: t,
      height: t,
      depth: t,
      fill: CoreColor(0, 0, 0),
      stroke: s,
      strokeWidth: sw,
    }),
    React.createElement(Box, {
      id: `${id}-x`,
      position: Vector3(t / 2 + L / 2, 0, 0),
      width: L,
      height: t,
      depth: t,
      fill: Red,
      stroke: s,
      strokeWidth: sw,
    }),
    React.createElement(Box, {
      id: `${id}-y`,
      position: Vector3(0, t / 2 + L / 2, 0),
      width: t,
      height: L,
      depth: t,
      fill: Green,
      stroke: s,
      strokeWidth: sw,
    }),
    React.createElement(Box, {
      id: `${id}-z`,
      position: Vector3(0, 0, t / 2 + L / 2),
      width: t,
      height: t,
      depth: L,
      fill: Blue,
      stroke: s,
      strokeWidth: sw,
    })
  );
}


