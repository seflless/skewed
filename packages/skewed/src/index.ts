export * from "./react";
export * as core from "./core";

// Convenience re-exports for common core utilities that don't conflict with React primitives.
export {
  Camera,
  Color,
  Red,
  Green,
  Blue,
  Vector3,
  Matrix4x4,
  Euler,
  BoxMesh,
  extrude,
  renderToSvgString,
} from "./core";

export type { Viewport } from "./core";
