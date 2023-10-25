import { Mesh } from "../meshes/Mesh";
import { Vector3 } from "../math/Vector3";
import { Color } from "../colors/Color";

export type TransformProperties = {
  position: Vector3;
  rotation: Vector3;
  scale: number;
};

export const DefaultTransformProperties = (): TransformProperties => ({
  position: Vector3(0, 0, 0),
  rotation: Vector3(0, 0, 0),
  scale: 1,
});

export type EventProperties = {
  onPointerDown?: (
    event: PointerEvent,
    start: Vector3,
    direction: Vector3
  ) => void;
  onPointerMove?: (
    event: PointerEvent,
    start: Vector3,
    direction: Vector3
  ) => void;
  onPointerUp?: (event: PointerEvent) => void;
};

export type BasicShapeProperties = EventProperties &
  TransformProperties & {
    fill: Color;
    stroke: Color;
    strokeWidth: number;
    id: string;
  };

export const DefaultBasicShapeProperties = (): BasicShapeProperties => ({
  ...DefaultTransformProperties(),
  fill: Color(128, 128, 128),
  stroke: Color(0, 0, 0),
  strokeWidth: 1,
  id: "",
});

export const DefaultShapeDimension = 100;
export const DefaultFontSize = 16;

export type MeshShape = {
  type: "mesh";
  mesh: Mesh;
} & BasicShapeProperties;

export type SphereShape = {
  type: "sphere";
  radius: number;
} & BasicShapeProperties;

export type CylinderShape = {
  type: "cylinder";
  radius: number;
  height: number;
} & BasicShapeProperties;

export type TextShape = BasicShapeProperties & {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
};

export type SvgShape = BasicShapeProperties & {
  type: "svg";
  svg: SVGElement;
};

export type ArrowShape = BasicShapeProperties & {
  type: "arrow";
  start: Vector3;
  middleOffset: number;
  end: Vector3;
};

export type ImageShape = BasicShapeProperties & {
  type: "image";
  image: HTMLImageElement;
};

export type GroupShape = EventProperties &
  TransformProperties & {
    type: "group";
    id: string;
    children: Shape[];
  };

export type GridShape = BasicShapeProperties & {
  type: "grid";
  id: string;
  children: Shape[];
  cellCount: number;
  cellSize: number;
};

export type Shape =
  | MeshShape
  | SphereShape
  | CylinderShape
  | TextShape
  | SvgShape
  | ArrowShape
  | GroupShape
  | GridShape;
