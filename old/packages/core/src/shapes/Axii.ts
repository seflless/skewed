import { Blue, Color, Green, Red } from "../colors/Color";
import { Vector3 } from "../math/Vector3";
import { Box } from "./Box";
import { Group } from "./Group";
import {
  DefaultBasicShapeProperties,
  DefaultShapeDimension,
  DefaultTransformProperties,
  GroupShape,
} from "./Shape";

export type AxiiProperties = {
  id: string;
  // Applies to the whole axii group.
  position: ReturnType<typeof Vector3>;
  rotation: ReturnType<typeof Vector3>;
  scale: number;
  // Styling shared by all boxes.
  stroke: Color;
  strokeWidth: number;
};

const DefaultAxiiProperties: AxiiProperties = {
  id: "axii",
  ...DefaultTransformProperties(),
  stroke: Color(0, 0, 0),
  strokeWidth: 0.5,
};

/**
 * Axii is a helper shape: 3 colored axis bars (x/y/z) plus a small black origin cube.
 *
 * - Natural size: DefaultShapeDimension³ (axis length = DefaultShapeDimension)
 * - Axis thickness: DefaultShapeDimension / 10
 * - Origin cube size: DefaultShapeDimension / 10
 *
 * The axes start at the origin cube and extend in the +X, +Y, +Z directions.
 */
export function Axii(props?: Partial<AxiiProperties>): GroupShape {
  const p = { ...DefaultAxiiProperties, ...(props ?? {}) };
  const L = DefaultShapeDimension;
  const t = DefaultShapeDimension / 10;

  // Origin cube centered at (0,0,0)
  const origin = Box({
    id: `${p.id}-origin`,
    position: Vector3(0, 0, 0),
    width: t,
    height: t,
    depth: t,
    fill: Color(0, 0, 0),
    stroke: p.stroke,
    strokeWidth: p.strokeWidth,
  });

  // Each axis bar is positioned so it touches the origin cube face and extends outward.
  const xAxis = Box({
    id: `${p.id}-x`,
    position: Vector3(t / 2 + L / 2, 0, 0),
    width: L,
    height: t,
    depth: t,
    fill: Red,
    stroke: p.stroke,
    strokeWidth: p.strokeWidth,
  });

  const yAxis = Box({
    id: `${p.id}-y`,
    position: Vector3(0, t / 2 + L / 2, 0),
    width: t,
    height: L,
    depth: t,
    fill: Green,
    stroke: p.stroke,
    strokeWidth: p.strokeWidth,
  });

  const zAxis = Box({
    id: `${p.id}-z`,
    position: Vector3(0, 0, t / 2 + L / 2),
    width: t,
    height: t,
    depth: L,
    fill: Blue,
    stroke: p.stroke,
    strokeWidth: p.strokeWidth,
  });

  return Group({
    id: p.id,
    position: p.position,
    rotation: p.rotation,
    scale: p.scale,
    children: [origin, xAxis, yAxis, zAxis].map((s) => ({
      ...DefaultBasicShapeProperties(),
      ...s,
    })),
  });
}


