import { Camera, projectToScreenCoordinate } from "../cameras/Camera";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { SvgShape } from "../shapes/Shape";
import { Scene } from "./Scene";
import { Viewport, pointerToWorldStartDirection } from "./Viewport";
import { generateSVGTransformMatrix } from "./svgUtils";

export function renderSvg(
  scene: Scene,
  svg: SVGElement,
  _defs: SVGDefsElement,
  svgShape: SvgShape,
  viewport: Viewport,
  camera: Camera,
  worldTransform: Matrix4x4,
  cameraZoom: number,
  _cameraDirection: Vector3,
  inverseCameraMatrix: Matrix4x4,
  inverseAndProjectionMatrix: Matrix4x4
) {
  const svgScaleFactor = worldTransform.getScale().x * cameraZoom;

  const transformMatrixCameraSpace = inverseCameraMatrix
    .clone()
    .multiply(worldTransform)
    .extractRotation();
  const faceNormalInWorldSpace = Vector3(0, 0, 0);
  worldTransform.extractBasis(undefined, undefined, faceNormalInWorldSpace);

  // Convert the light direction into camera space (not projected into screen space)
  const directionalLightInCameraSpace = scene.directionalLight.direction
    .clone()
    .multiply(-1);
  inverseCameraMatrix
    .extractRotation()
    .applyToVector3(directionalLightInCameraSpace);

  const faceNormalInCameraSpace = Vector3(0, 0, 0);
  transformMatrixCameraSpace.extractBasis(
    undefined,
    undefined,
    faceNormalInCameraSpace
  );
  const facingWayFromCamera = faceNormalInCameraSpace.z < 0;
  if (facingWayFromCamera) {
    faceNormalInCameraSpace.multiply(-1);
  }

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  g.appendChild(svgShape.svg);

  const { x, y } = projectToScreenCoordinate(
    worldTransform.getTranslation().add(faceNormalInWorldSpace),
    inverseAndProjectionMatrix,
    viewport
  );

  const transformMatrixText = generateSVGTransformMatrix(
    x,
    y,
    transformMatrixCameraSpace,
    svgScaleFactor
  );
  g.setAttribute("transform", transformMatrixText);

  svg.appendChild(g);

  g.addEventListener("pointerdown", (event) => {
    const { start, direction } = pointerToWorldStartDirection(
      viewport,
      camera,
      event.clientX,
      event.clientY
    );

    svgShape.onPointerDown?.(svgShape, event, start, direction);
  });

  if (svgShape.onPointerMove) {
    g.addEventListener("pointermove", (event) => {
      const { start, direction } = pointerToWorldStartDirection(
        viewport,
        camera,
        event.clientX,
        event.clientY
      );
      svgShape.onPointerMove?.(svgShape, event, start, direction);
    });
  }

  if (svgShape.onPointerUp) {
    g.addEventListener("pointerup", (event) => {
      if (svgShape.onPointerUp) {
        svgShape.onPointerUp(svgShape, event);
      }
    });
  }
}
