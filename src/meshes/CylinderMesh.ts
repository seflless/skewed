import { Vector3 } from "../Vector3";
import { extrude } from "./Extrude";

const segments = 360 / 2;
const height = 300;
const radius = 100;

const indices: Vector3[] = [];
for (let i = 0; i < segments; i++) {
  indices.push(
    Vector3(
      (Math.cos((i / segments) * 2 * Math.PI) * radius) / 2,
      0,
      (Math.sin((i / segments) * 2 * Math.PI) * radius) / 2
    )
  );
}

export const CylinderMesh = extrude(indices, height);
