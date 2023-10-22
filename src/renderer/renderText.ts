import { projectToScreenCoordinate } from "../cameras/Camera";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { TextShape } from "../shapes/Shape";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";
import { Color, ColorToCSS } from "../colors/Color";
import { Euler, EulerOrder } from "../math/Euler";
// import { DebugLine2D } from "./DebugRenderer";
import { applyLighting } from "../lighting/LightingModel";
import { generateSVGTransformMatrix } from "./svgUtils";

export function renderText(
  scene: Scene,
  svg: SVGElement,
  _defs: SVGDefsElement,
  textShape: TextShape,
  viewport: Viewport,
  worldTransform: Matrix4x4,
  cameraZoom: number,
  _cameraDirection: Vector3,
  inverseCameraMatrix: Matrix4x4,
  inverseAndProjectionMatrix: Matrix4x4
) {
  const textScale = worldTransform.getScale().x;
  const textScaleFactor = textScale * cameraZoom;

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

  const fill = applyLighting(
    scene.directionalLight.color,
    textShape.fill,
    scene.ambientLightColor,
    directionalLightInCameraSpace.dotProduct(faceNormalInCameraSpace)
  );

  function renderTextStackSlice(
    offset: number,
    fillString: string,
    strokeString: string
  ) {
    const textElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    textElement.setAttribute("id", "text");

    const { x, y } = projectToScreenCoordinate(
      worldTransform
        .getTranslation()
        .add(faceNormalInWorldSpace.clone().multiply(offset)),
      inverseAndProjectionMatrix,
      viewport
    );

    textElement.setAttribute("font-size", textShape.fontSize.toFixed(2));
    textElement.setAttribute("font-family", textShape.fontFamily);
    textElement.setAttribute("fill", fillString);

    textElement.setAttribute("stroke", strokeString);
    textElement.setAttribute("stroke-width", textShape.strokeWidth.toFixed(2));

    // Align the text to the center
    textElement.setAttribute("text-anchor", "middle");
    textElement.setAttribute("dominant-baseline", "middle");

    textElement.textContent = textShape.text;

    const transformMatrixText = generateSVGTransformMatrix(
      x,
      y,
      transformMatrixCameraSpace,
      textScaleFactor
    );
    textElement.setAttribute("transform", transformMatrixText);

    svg.appendChild(textElement);
  }

  renderTextStackSlice(0, fill, ColorToCSS(textShape.stroke));
}
