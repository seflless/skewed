import { Matrix4x4 } from "../math/Matrix4x4";
import { Viewport } from "../renderer/Viewport";

export interface Camera {
  matrix: Matrix4x4;
  projectionMatrix: Matrix4x4;
}

const CameraProto = {};

export function Camera(): Camera;
export function Camera(matrix: Matrix4x4): Camera;

export function Camera(matrix?: Matrix4x4): Camera {
  if (matrix) {
    return createCamera(matrix, Matrix4x4.identity());
  } else {
    return createCamera(Matrix4x4.identity(), Matrix4x4.identity());
  }
}

function createCamera(matrix: Matrix4x4, projectionMatrix: Matrix4x4): Camera {
  return Object.assign(Object.create(CameraProto), {
    matrix,
    projectionMatrix,
  });
}

export function point3DToIsometric(
  x: number,
  y: number,
  z: number,
  viewport: Viewport
) {
  return {
    x: (x - z) * Math.cos(Math.PI / 6) + viewport.width / 2,
    y: (x + z) * Math.sin(Math.PI / 6) - y + viewport.height / 2,
  };
}

export function point3DToCabinet(
  x: number,
  y: number,
  z: number,
  viewport: Viewport
) {
  // Oblique angle usually is 45 degrees for cabinet projection.
  let alpha = Math.PI / 4;

  // scale factor typically half in depth (z) direction.
  let scale = 0.5;

  return {
    x: x + scale * z * Math.cos(alpha) + viewport.width / 2,
    y: y + scale * z * Math.sin(alpha) + viewport.height / 2,
  };
}
