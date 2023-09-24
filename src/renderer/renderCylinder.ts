// All of this code is based on this early prototype:
// https://codesandbox.io/s/directionally-lit-sphere-using-svg-radial-gradients-c32ncz?file=/src/Sphere.tsx:2108-4852
// and this Observable Notebook
// https://observablehq.com/d/011f054fc7eaf966

import { projectToScreenCoordinate } from "../cameras/Camera";
import { Color, ColorToCSS } from "../colors/Color";
import { applyLighting } from "../lighting/LightingModel";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { CylinderShape } from "../shapes/Shape";
import { Scene } from "./Scene";
import { Viewport } from "./Viewport";

enum CylinderEnds {
  Top = 0,
  Bottom = 1,
}

export function renderCylinder(
  scene: Scene,
  svg: SVGElement,
  _defs: SVGDefsElement,
  cylinder: CylinderShape,
  viewport: Viewport,
  worldTransform: Matrix4x4,
  cameraZoom: number,
  cameraDirection: Vector3,
  inverseCameraMatrix: Matrix4x4,
  inverseAndProjectionMatrix: Matrix4x4
) {
  const points: Vector3[] = [
    // Top
    Vector3(0, cylinder.height / 2, 0),
    // Bottom
    Vector3(0, -cylinder.height / 2, 0),
  ].map((point) => {
    worldTransform.applyToVector3(point);

    return projectToScreenCoordinate(
      point,
      inverseAndProjectionMatrix,
      viewport
    );
  });

  const yAxisWorldSpace = Vector3(0, 0, 0);
  worldTransform.extractBasis(
    Vector3(0, 0, 0),
    yAxisWorldSpace,
    Vector3(0, 0, 0)
  );
  const yAxisCameraSpace = yAxisWorldSpace.clone();
  inverseCameraMatrix.applyToVector3(yAxisCameraSpace);

  const cylinderScale = worldTransform.getScale().x;
  const cylinderScaleFactor = cylinderScale * cameraZoom;
  const Radius = cylinder.radius * cylinderScaleFactor;

  // Top === -1
  // Front === 0
  // Bottom === 1
  const dotProduct = yAxisWorldSpace.dotProduct(
    cameraDirection.clone().multiply(-1)
  );
  const dotProductAbsolute = Math.abs(dotProduct);

  const ShortRadius = Radius * dotProductAbsolute;

  console.log(
    `dotProduct: ${dotProduct.toFixed(3)} 
    yAxisCameraSpace: ${yAxisCameraSpace.x.toFixed(
      2
    )}, ${yAxisCameraSpace.y.toFixed(2)}, ${yAxisCameraSpace.z.toFixed(2)}`
  );
  const isTopVisible = dotProduct > 0;

  const yAxisScreenSpace = Vector3(yAxisCameraSpace.x, -yAxisCameraSpace.y, 0)
    .normalize()
    .multiply(isTopVisible ? 1 : -1);

  const capCenter = isTopVisible
    ? points[CylinderEnds.Top]
    : points[CylinderEnds.Bottom];

  const tailCenter = isTopVisible
    ? points[CylinderEnds.Bottom]
    : points[CylinderEnds.Top];

  // addCylinderEnd(
  //   capCenter,
  //   cylinder.radius,
  //   dotProduct,
  //   isTopVisible ? Color(255, 0, 0) : Color(0, 0, 255),
  //   svg
  // );

  const leftNormal = Vector3(-yAxisScreenSpace.y, yAxisScreenSpace.x, 0);
  const rightNormal = Vector3(yAxisScreenSpace.y, -yAxisScreenSpace.x, 0);
  const topLeftPoint = leftNormal.clone().multiply(Radius).add(capCenter);
  const topRightPoint = rightNormal.clone().multiply(Radius).add(capCenter);
  const bottomLeftPoint = leftNormal.clone().multiply(Radius).add(tailCenter);
  const bottomRightPoint = rightNormal.clone().multiply(Radius).add(tailCenter);

  const xAxisRotation = normalToXAxisDegrees(rightNormal.x, rightNormal.y);
  const largeArcFlag = 0;
  const sweepFlag = 0;

  const reversedLightDirection = scene.directionalLight.direction
    .clone()
    .multiply(-1);

  const capPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  capPath.setAttribute("id", "cylinder-top");
  capPath.setAttribute(
    "fill",
    applyLighting(
      scene.directionalLight.color,
      cylinder.fill,
      scene.ambientLightColor,
      isTopVisible
        ? reversedLightDirection.dotProduct(yAxisWorldSpace)
        : reversedLightDirection.dotProduct(
            yAxisWorldSpace.clone().multiply(-1)
          )
    )
  );

  if (cylinder.strokeWidth && cylinder.stroke.a > 0.0) {
    capPath.setAttribute("stroke", ColorToCSS(cylinder.stroke));

    if (cylinder.strokeWidth !== 1.0) {
      capPath.setAttribute(
        "stroke-width",
        (cylinder.strokeWidth * cylinderScaleFactor).toString()
      );
    }
  }

  capPath.setAttribute(
    "d",
    `
    M ${topLeftPoint.x} ${
      topLeftPoint.y
    } A ${Radius} ${ShortRadius} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${
      topRightPoint.x
    } ${topRightPoint.y}
    A ${Radius} ${ShortRadius} ${xAxisRotation} ${1} ${sweepFlag} ${
      topLeftPoint.x
    } ${topLeftPoint.y}`
  );

  const tubePath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  tubePath.setAttribute("id", "cylinder-tube");
  tubePath.setAttribute("fill", "purple");
  tubePath.setAttribute(
    "d",
    `
    M ${topLeftPoint.x} ${topLeftPoint.y} 
    A ${Radius} ${ShortRadius} ${xAxisRotation} 0 1 ${topRightPoint.x} ${topRightPoint.y}
    L ${bottomRightPoint.x} ${bottomRightPoint.y}
    A ${Radius} ${ShortRadius} ${xAxisRotation} 0 0 ${bottomLeftPoint.x} ${bottomLeftPoint.y}
    `
  );
  svg.appendChild(tubePath);
  svg.appendChild(capPath);

  // Scenarios we can view the cylinder from:
  // 1. From the top/bottom (can't see the tube)
  // 2. From the side (can't see the top or bottom)
  // 3. From a diagonal (can see the tube and either the top or bottom)

  // Are we viewing the cylinder from the top or bottom?

  // points.forEach(({ x, y }, index) => {
  //   const circle = document.createElementNS(
  //     "http://www.w3.org/2000/svg",
  //     "circle"
  //   );

  //   circle.id = "sphere";
  //   circle.setAttribute("cx", x.toString());
  //   circle.setAttribute("cy", y.toString());

  //   // TODO: Factor in camera projection matrix, this currectly
  //   // ignores all zoom factors. Can we even handle skew with sphere?!
  //   // I don't think we can.
  //   circle.setAttribute("r", (5).toString());

  //   circle.setAttribute(
  //     "fill",
  //     index === CylinderEnds.Top ? "rgb(128,0,0)" : "rgb(0,0,128)"
  //   );

  //   svg.appendChild(circle);
  // });

  // Get the center of the cylinder's top face

  // Get the center of the cylinder's bottom face
}

function addCylinderEnd(
  { x, y }: Vector3,
  radius: number,
  dotProductAbsolute: number,
  fill: Color,
  svg: SVGElement
) {
  // Create a 'circle' element
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "ellipse"
  );

  circle.id = "sphere";
  circle.setAttribute("cx", x.toString());
  circle.setAttribute("cy", y.toString());

  // TODO: Factor in camera projection matrix, this currectly
  // ignores all zoom factors. Can we even handle skew with sphere?!
  // I don't think we can.
  circle.setAttribute("rx", radius.toString());
  circle.setAttribute("ry", (radius * dotProductAbsolute).toString());

  circle.setAttribute("fill", ColorToCSS(fill));

  svg.appendChild(circle);
}

function normalToXAxisDegrees(x: number, y: number) {
  return (Math.atan2(y, x) / Math.PI) * 180;
}
