import { projectToScreenCoordinate } from "../cameras/Camera";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { ArrowShape } from "../shapes/Shape";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";
import { Color, ColorToCSS } from "../colors/Color";
import { Euler, EulerOrder } from "../math/Euler";
// import { DebugLine2D } from "./DebugRenderer";
import { applyLighting } from "../lighting/LightingModel";
import { generateSVGTransformMatrix } from "./svgUtils";

export function renderArrow(
  scene: Scene,
  svg: SVGElement,
  _defs: SVGDefsElement,
  arrowShape: ArrowShape,
  viewport: Viewport,
  worldTransform: Matrix4x4,
  cameraZoom: number,
  _cameraDirection: Vector3,
  inverseCameraMatrix: Matrix4x4,
  inverseAndProjectionMatrix: Matrix4x4
) {
  const arrowScaleFactor = worldTransform.getScale().x * cameraZoom;

  const transformMatrixCameraSpace = inverseCameraMatrix
    .clone()
    .multiply(worldTransform)
    .extractRotation();

  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathElement.setAttribute("id", "arrow");

  const startPosition = arrowShape.start.clone();
  worldTransform.applyToVector3(startPosition);
  const endPosition = arrowShape.end.clone();
  worldTransform.applyToVector3(endPosition);

  const start = projectToScreenCoordinate(
    startPosition,
    inverseAndProjectionMatrix,
    viewport
  );

  const end = projectToScreenCoordinate(
    endPosition,
    inverseAndProjectionMatrix,
    viewport
  );

  const middle = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2 - arrowShape.middleOffset,
  };

  const middleToEndDiff = {
    x: end.x - middle.x,
    y: end.y - middle.y,
  };
  const middleToEndDistance = Math.sqrt(
    middleToEndDiff.x * middleToEndDiff.x +
      middleToEndDiff.y * middleToEndDiff.y
  );

  const arrowHeadLineLength = 25;
  const arrowPullBackAmount = 1.25;
  const arrowHeadDir = {
    x: middleToEndDiff.x / middleToEndDistance,
    y: middleToEndDiff.y / middleToEndDistance,
  };
  const arrowTipLeft = {
    x:
      end.x +
      arrowHeadDir.y * arrowHeadLineLength -
      arrowHeadDir.x * arrowHeadLineLength * arrowPullBackAmount,
    y:
      end.y -
      arrowHeadDir.x * arrowHeadLineLength -
      arrowHeadDir.y * arrowHeadLineLength * arrowPullBackAmount,
  };

  const arrowTipRight = {
    x:
      end.x -
      arrowHeadDir.y * arrowHeadLineLength -
      arrowHeadDir.x * arrowHeadLineLength * arrowPullBackAmount,
    y:
      end.y +
      arrowHeadDir.x * arrowHeadLineLength -
      arrowHeadDir.y * arrowHeadLineLength * arrowPullBackAmount,
  };

  pathElement.setAttribute(
    "d",
    `M ${start.x} ${start.y} Q ${middle.x} ${middle.y} ${end.x} ${end.y} L ${arrowTipLeft.x} ${arrowTipLeft.y} M ${end.x} ${end.y} L ${arrowTipRight.x} ${arrowTipRight.y}`
  );

  pathElement.setAttribute("stroke-linecap", "round");
  pathElement.setAttribute("stroke-linejoin", "round");

  if (arrowShape.strokeWidth && arrowShape.stroke.a > 0.0) {
    pathElement.setAttribute("stroke", ColorToCSS(arrowShape.stroke));

    if (arrowShape.strokeWidth !== 1.0) {
      pathElement.setAttribute(
        "stroke-width",
        (arrowShape.strokeWidth * arrowScaleFactor).toString()
      );
    }
  }

  pathElement.setAttribute("fill", "none");

  svg.appendChild(pathElement);
}
