import { Blue, Box, Color, Green, Group, Red, Vector3 } from "../src";

const Axii_Thickness = 4;
const Axii_Length = 100;

export function Axii(position?: Vector3) {
  const strokeWidth = 0.5;
  if (!position) {
    position = Vector3(0, 0, 0);
  }
  return Group({
    children: [
      Box({
        position: Vector3(Axii_Thickness / 2 + Axii_Length / 2, 0, 0).add(
          position
        ),
        rotation: Vector3(0, 0, 0),
        scale: 1.0,
        width: Axii_Length,
        height: Axii_Thickness,
        depth: Axii_Thickness,
        fill: Red,
        stroke: Color(0, 0, 0),
        strokeWidth,
      }),
      Box({
        position: Vector3(0, Axii_Thickness / 2 + Axii_Length / 2, 0).add(
          position
        ),
        rotation: Vector3(0, 0, 0),
        scale: 1.0,
        width: Axii_Thickness,
        height: Axii_Length,
        depth: Axii_Thickness,
        fill: Green,
        stroke: Color(0, 0, 0),
        strokeWidth,
      }),
      Box({
        position: Vector3(0, 0, Axii_Thickness / 2 + Axii_Length / 2).add(
          position
        ),
        rotation: Vector3(0, 0, 0),
        scale: 1.0,
        width: Axii_Thickness,
        height: Axii_Thickness,
        depth: Axii_Length,
        fill: Blue,
        stroke: Color(0, 0, 0),
        strokeWidth,
      }),
    ],
  });
}
