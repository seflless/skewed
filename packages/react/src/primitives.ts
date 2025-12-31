import * as React from "react";
import type { Mesh } from "@skewed/core";
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


