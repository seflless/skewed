import { Vector3 } from "../math/Vector3";
import { extrude } from "./Extrude";

function circlePolyline(radius: number, segments: number): Vector3[] {
  const vertices: Vector3[] = [];
  for (let i = 0; i < segments; i++) {
    vertices.push(
      Vector3(
        Math.cos((i / segments) * 2 * Math.PI) * radius,
        0,
        Math.sin((i / segments) * 2 * Math.PI) * radius
      )
    );
  }
  return vertices;
}

export function CylinderMesh(radius: number, height: number, segments: number) {
  return extrude(circlePolyline(radius, segments), height);
}
