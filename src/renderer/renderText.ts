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

  // const { x, y } = projectToScreenCoordinate(
  //   worldTransform
  //     .getTranslation()
  //     .add(faceNormalInWorldSpace.clone().multiply(offset)),
  //   inverseAndProjectionMatrix,
  //   viewport
  // );

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  // g.setAttribute("transform", `translate(${x},${y})`);
  group.id = textShape.text;
  svg.appendChild(group);

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

  // console.log(`facingWayFromCamera: ${facingWayFromCamera}`);

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

    // DebugLine2D(
    //   svg,
    //   viewport,
    //   x,
    //   y,
    //   x + faceNormalInCameraSpace.x * 100,
    //   y - faceNormalInCameraSpace.y * 100,
    //   Color(255, 0, 0)
    // );

    //   textElement.setAttribute("x", x.toFixed(2));
    //   textElement.setAttribute("y", y.toFixed(2));

    textElement.setAttribute("font-size", textShape.fontSize.toFixed(2));
    textElement.setAttribute("font-family", textShape.fontFamily);
    // textElement.setAttribute("fill", ColorToCSS(textShape.fill));
    textElement.setAttribute("fill", fillString);

    textElement.setAttribute("stroke", strokeString);
    textElement.setAttribute("stroke-width", textShape.strokeWidth.toFixed(2));
    // Align the text to the center
    textElement.setAttribute("text-anchor", "middle");
    textElement.setAttribute("dominant-baseline", "middle");

    textElement.textContent = textShape.text;

    const e = transformMatrixCameraSpace.elements;

    const xAxis = { x: e[0] * textScaleFactor, y: -e[1] * textScaleFactor };
    const yAxis = { x: -e[4] * textScaleFactor, y: e[5] * textScaleFactor };

    // Attempt to prevent fully grazing view angles by slightly purturbing the
    // face normal to make the slices have a minimal silhouette
    const amount = 0.1;
    if (Math.abs(yAxis.x) < amount) {
      yAxis.x = amount;

      console.log("grazing angle");
      // faceNormalInCameraSpace.x *= amount;
    }

    const precision = 3;
    const transformMatrixText = `matrix(${xAxis.x.toFixed(
      precision
    )} ${xAxis.y.toFixed(precision)} ${yAxis.x.toFixed(
      precision
    )} ${yAxis.y.toFixed(precision)} ${x.toFixed(precision)} ${y.toFixed(
      precision
    )})`;
    textElement.setAttribute("transform", transformMatrixText);

    group.appendChild(textElement);

    // DebugLine2D(
    //   svg,
    //   viewport,
    //   x,
    //   y,
    //   x + xAxis.x * 100,
    //   y + xAxis.y * 100,
    //   Color(255, 0, 0)
    // );
    // DebugLine2D(
    //   svg,
    //   viewport,
    //   x,
    //   y,
    //   x + yAxis.x * 100,
    //   y + yAxis.y * 100,
    //   Color(0, 255, 0)
    // );
  }

  const layerColorString = "rgb(48,48,48)";

  const pixelThickness = textScaleFactor * textShape.thickness;
  // const layerCount = 20;
  const layerCount = pixelThickness;
  const layerSeparation = 1;
  const offsetToMiddle = (layerCount * layerSeparation) / 2;

  for (let i = 0; i < layerCount; i++) {
    const offset =
      (facingWayFromCamera ? i + 1 : layerCount - i - 1) * layerSeparation;

    renderTextStackSlice(
      offset - offsetToMiddle,
      layerColorString,
      layerColorString
    );
  }

  renderTextStackSlice(
    facingWayFromCamera
      ? -offsetToMiddle
      : layerSeparation * layerCount - offsetToMiddle,
    fill,
    ColorToCSS(textShape.stroke)
  );
}
