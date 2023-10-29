import { Camera, extractOrthographicDimensions } from "../cameras/Camera";
import { Vector3 } from "../math/Vector3";

export type Viewport = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function pointerToWorldStartDirection(
  viewport: Viewport,
  camera: Camera,
  clientX: number,
  clientY: number
): { start: Vector3; direction: Vector3 } {
  const extractOrthographicDimensionsResult = extractOrthographicDimensions(
    camera.projectionMatrix
  );
  const cameraZoom = camera;
  const x = (clientX - viewport.width / 2) * camera.zoom;
  const y = (clientY - viewport.height / 2) * -camera.zoom;
  // console.log(`x/y: ${x}, ${y}`);
  // console.log(
  //   `cameraPosition: ${cameraPosition.x}, ${cameraPosition.y}, ${cameraPosition.z}`
  // );
  const start = camera.matrix
    .getTranslation()
    .add(camera.matrix.getRight().multiply(x))
    .add(camera.matrix.getUp().multiply(y))
    // Move far back from the camera plane to ensure the ray intersects with things projected
    // onto the camera plane. Number should be bigger than any possible screen dimension and then
    // some
    .add(camera.matrix.getBackwards().multiply(-1000));

  // console.log(`point: ${point.x}, ${point.y}, ${point.z}`);
  return {
    start,
    direction: camera.matrix.getForward(),
  };
}
