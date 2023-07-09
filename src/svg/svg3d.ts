import path from "path";
import { Vector3 } from "../math/Vector3";
import invariant from "invariant";

// Full set of SVG path commands:
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands

export type SVG3DMoveCommand = { command: "move"; points: [Vector3] };
export type SVG3DLineCommand = { command: "line"; points: [Vector3] };
export type SVG3DCloseCommand = { command: "closePath" };
export type SVG3DCubicBezierCommand = {
  command: "cubicBezier";

  // Control point 1, control point 2, end point
  points: [Vector3, Vector3, Vector3];
};

export type SVG3DQuadraticBezierCommand = {
  command: "cubicBezier";

  // Control point 1, control point 2, end point
  points: [Vector3, Vector3];
};

// No support for elliptical arc yet
export type SVG3DCommand =
  | SVG3DMoveCommand
  | SVG3DLineCommand
  | SVG3DCloseCommand
  | SVG3DCubicBezierCommand
  | SVG3DQuadraticBezierCommand;

function xyToFloorPlane(x: number, y: number): Vector3 {
  return Vector3(x, 0, -y);
}

export function svgPathToSvg3DCommands(pathSegments: any): SVG3DCommand[] {
  invariant(
    Array.isArray(pathSegments),
    "Expected path segments to be an array"
  );
  invariant(pathSegments.length > 0, "Expected path segments to be non-empty");

  const commands: SVG3DCommand[] = [];
  for (let pathSegment of pathSegments) {
    switch (pathSegment[0]) {
      case "M":
        commands.push({
          command: "move",
          points: [xyToFloorPlane(pathSegment[1], pathSegment[2])],
        });
        break;
      case "L":
        commands.push({
          command: "line",
          points: [xyToFloorPlane(pathSegment[1], pathSegment[2])],
        });
        break;
      case "Z":
        commands.push({ command: "closePath" });
        break;
      case "C":
        commands.push({
          command: "cubicBezier",
          points: [
            xyToFloorPlane(pathSegment[1], pathSegment[2]),
            xyToFloorPlane(pathSegment[3], pathSegment[4]),
            xyToFloorPlane(pathSegment[5], pathSegment[6]),
          ],
        });
        break;
    }
  }
  return commands;
}
