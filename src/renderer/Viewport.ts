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
  const xAxis = Vector3(0, 0, 0);
  const yAxis = Vector3(0, 0, 0);
  const zAxis = Vector3(0, 0, 0);
  camera.matrix.extractBasis(xAxis, yAxis, zAxis);

  const extractOrthographicDimensionsResult = extractOrthographicDimensions(
    camera.projectionMatrix
  );
  const cameraZoom = viewport.width / extractOrthographicDimensionsResult.width;
  const x = (clientX - viewport.width / 2) * cameraZoom;
  const y = (clientY - viewport.height / 2) * -cameraZoom;
  const cameraPosition = camera.matrix.getTranslation();
  // console.log(`x/y: ${x}, ${y}`);
  // console.log(
  //   `cameraPosition: ${cameraPosition.x}, ${cameraPosition.y}, ${cameraPosition.z}`
  // );
  const point = cameraPosition
    .clone()
    .add(xAxis.clone().multiply(x))
    .add(yAxis.clone().multiply(y));

  // console.log(`point: ${point.x}, ${point.y}, ${point.z}`);
  return {
    start: point.clone(),
    direction: zAxis.clone(),
  };
}
