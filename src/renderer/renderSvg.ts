import { projectToScreenCoordinate } from "../cameras/Camera";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { SvgShape, TextShape } from "../shapes/Shape";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";
import { Color, ColorToCSS } from "../colors/Color";
import { Euler, EulerOrder } from "../math/Euler";
// import { DebugLine2D } from "./DebugRenderer";
import { applyLighting } from "../lighting/LightingModel";
import { generateSVGTransformMatrix } from "./svgUtils";

export function renderSvg(
  scene: Scene,
  svg: SVGElement,
  _defs: SVGDefsElement,
  svgShape: SvgShape,
  viewport: Viewport,
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

  const fillColor = applyLighting(
    scene.directionalLight.color,
    svgShape.fill,
    scene.ambientLightColor,
    directionalLightInCameraSpace.dotProduct(faceNormalInCameraSpace)
  );
  const fillString = ColorToCSS(fillColor);

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  group.appendChild(svgShape.svg);

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
  group.setAttribute("transform", transformMatrixText);

  svg.appendChild(group);
}
