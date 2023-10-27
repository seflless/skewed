import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { Viewport } from "../renderer/Viewport";

export interface Camera {
  matrix: Matrix4x4;
  projectionMatrix: Matrix4x4;
  zoom: number;
}

const CameraProto = {};

export function Camera(): Camera;
export function Camera(zoom?: number): Camera;
export function Camera(zoom: number, matrix: Matrix4x4): Camera;

export function Camera(zoom: number = 1, matrix?: Matrix4x4): Camera {
  if (matrix) {
    return createCamera(matrix, Matrix4x4.identity(), zoom);
  } else {
    return createCamera(Matrix4x4.identity(), Matrix4x4.identity(), zoom);
  }
}

function createCamera(
  matrix: Matrix4x4,
  projectionMatrix: Matrix4x4,
  zoom: number
): Camera {
  return Object.assign(Object.create(CameraProto), {
    matrix,
    projectionMatrix,
    zoom,
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

export function projectToScreenCoordinate(
  vertex: Vector3,
  inverseAndProjectionMatrix: Matrix4x4,
  viewport: Viewport
): Vector3 {
  const v = Vector3(vertex);
  inverseAndProjectionMatrix.applyToVector3(v);
  v.x = (v.x * viewport.width) / 2 + viewport.width;
  v.y = (v.y * viewport.height) / 2;
  return v;
}

export function extractOrthographicDimensions(matrix: Matrix4x4): {
  width: number;
  height: number;
  depth: number;
} {
  const elements = matrix.elements;

  // These values represent how much the content is "squeezed" or "stretched"
  const scaleX = elements[0];
  const scaleY = elements[5];
  const scaleZ = elements[10];

  // Extracting the original width, height, and depth from the squeeze/stretch values.
  const width = 2 / scaleX;
  const height = 2 / scaleY;
  const depth = -2 / scaleZ; // we use -2 since the scaleZ is typically negative in a right-handed system

  return {
    width: width,
    height: height,
    depth: depth,
  };
}
