import { Camera, projectToScreenCoordinate } from "../cameras/Camera";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { TextShape } from "../shapes/Shape";
import { Scene } from "./Scene";
import { Viewport, pointerToWorldStartDirection } from "./Viewport";
import { ColorToCSS } from "../colors/Color";
import { applyLighting } from "../lighting/LightingModel";
import { generateSVGTransformMatrix } from "./svgUtils";

export function renderText(
  scene: Scene,
  svg: SVGElement,
  _defs: SVGDefsElement,
  textShape: TextShape,
  viewport: Viewport,
  camera: Camera,
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

  const fill = ColorToCSS(
    applyLighting(
      scene.directionalLight.color,
      textShape.fill,
      scene.ambientLightColor,
      directionalLightInCameraSpace.dotProduct(faceNormalInCameraSpace)
    )
  );

  const textElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  textElement.setAttribute("id", "text");

  const { x, y } = projectToScreenCoordinate(
    worldTransform.getTranslation().add(faceNormalInWorldSpace),
    inverseAndProjectionMatrix,
    viewport
  );

  textElement.setAttribute(
    "font-size",
    (textShape.fontSize * textScaleFactor).toFixed(2)
  );
  textElement.setAttribute("font-family", textShape.fontFamily);
  textElement.setAttribute("fill", fill);

  if (textShape.strokeWidth && textShape.stroke.a > 0.0) {
    textElement.setAttribute("stroke", ColorToCSS(textShape.stroke));

    if (textShape.strokeWidth !== 1.0) {
      textElement.setAttribute(
        "stroke-width",
        (textShape.strokeWidth * textScaleFactor).toString()
      );
    }
  }

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

  textElement.addEventListener("pointerdown", (event) => {
    const { start, direction } = pointerToWorldStartDirection(
      viewport,
      camera,
      event.clientX,
      event.clientY
    );

    textShape.onPointerDown?.(textShape, event, start, direction);
  });

  if (textShape.onPointerMove) {
    textElement.addEventListener("pointermove", (event) => {
      const { start, direction } = pointerToWorldStartDirection(
        viewport,
        camera,
        event.clientX,
        event.clientY
      );
      textShape.onPointerMove?.(textShape, event, start, direction);
    });
  }

  if (textShape.onPointerUp) {
    textElement.addEventListener("pointerup", (event) => {
      if (textShape.onPointerUp) {
        textShape.onPointerUp(textShape, event);
      }
    });
  }
}
