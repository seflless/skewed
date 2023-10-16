// All of this code is based on this early prototype:
// https://codesandbox.io/s/directionally-lit-sphere-using-svg-radial-gradients-c32ncz?file=/src/Sphere.tsx:2108-4852
// and this Observable Notebook
// https://observablehq.com/d/011f054fc7eaf966

import { projectToScreenCoordinate } from "../cameras/Camera";
import { ColorToCSS } from "../colors/Color";
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

const CrackFillingStrokeWidth = 0.5;

export function renderCylinder(
  scene: Scene,
  svg: SVGElement,
  defs: SVGDefsElement,
  cylinder: CylinderShape,
  viewport: Viewport,
  worldTransform: Matrix4x4,
  cameraZoom: number,
  _cameraDirection: Vector3,
  inverseCameraMatrix: Matrix4x4,
  inverseAndProjectionMatrix: Matrix4x4
) {
  // Get screen space coordinates for the top and bottom of the cylinder
  const capsInScreenSpace: Vector3[] = [
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

  const cylinderYAxisWorldSpace = Vector3(0, 0, 0);
  worldTransform.extractBasis(undefined, cylinderYAxisWorldSpace, undefined);

  const cylinderYAxisCameraSpace = cylinderYAxisWorldSpace.clone();
  inverseCameraMatrix
    .extractRotation()
    .applyToVector3(cylinderYAxisCameraSpace);

  // DebugLine2D(
  //   svg,
  //   viewport,
  //   0,
  //   0,
  //   cylinderYAxisCameraSpace.x * 100,
  //   -cylinderYAxisCameraSpace.y * 100,
  //   Color(255, 0, 0)
  // );

  // Top === -1
  // Front === 0
  // Bottom === 1
  const dotProduct = cylinderYAxisCameraSpace.dotProduct(Vector3(0, 0, 1)); // This boils down to just taking the z component
  const dotProductAbsolute = Math.abs(dotProduct);
  const isTopVisible = dotProduct > 0;
  console.log(`isTopVisible: ${isTopVisible}`);

  const cylinderScale = worldTransform.getScale().x;
  const cylinderScaleFactor = cylinderScale * cameraZoom;
  const Radius = cylinder.radius * cylinderScaleFactor;
  const ShortRadius = Radius * dotProductAbsolute;

  console.log(
    `scenario: ${isTopVisible ? "top" : "bottom"}
    dotProduct: ${dotProduct.toFixed(3)} 
    yAxisCameraSpace: ${cylinderYAxisCameraSpace.x.toFixed(
      2
    )}, ${cylinderYAxisCameraSpace.y.toFixed(
      2
    )}, ${cylinderYAxisCameraSpace.z.toFixed(2)}`
  );

  const visibleUpAxisWorldSpace = isTopVisible
    ? cylinderYAxisWorldSpace.clone()
    : cylinderYAxisWorldSpace.clone().multiply(-1);

  const visibleUpAxisCameraSpace = isTopVisible
    ? cylinderYAxisCameraSpace.clone()
    : cylinderYAxisCameraSpace.clone().multiply(-1);

  const visibleUpAxisScreenSpace = Vector3(
    visibleUpAxisCameraSpace.x,
    -visibleUpAxisCameraSpace.y,
    0
  ).normalize();
  // .multiply(isTopVisible ? 1 : -1);

  const visibleCapCenter = isTopVisible
    ? capsInScreenSpace[CylinderEnds.Top]
    : capsInScreenSpace[CylinderEnds.Bottom];

  const hiddenCapCenter = isTopVisible
    ? capsInScreenSpace[CylinderEnds.Bottom]
    : capsInScreenSpace[CylinderEnds.Top];

  const leftNormal = Vector3(
    -visibleUpAxisScreenSpace.y,
    visibleUpAxisScreenSpace.x,
    0
  );
  const rightNormal = Vector3(
    visibleUpAxisScreenSpace.y,
    -visibleUpAxisScreenSpace.x,
    0
  );
  const visibleLeftPoint = leftNormal
    .clone()
    .multiply(Radius)
    .add(visibleCapCenter);
  const visibleRightPoint = rightNormal
    .clone()
    .multiply(Radius)
    .add(visibleCapCenter);
  const hiddenLeftPoint = leftNormal
    .clone()
    .multiply(Radius)
    .add(hiddenCapCenter);
  const hiddenRightPoint = rightNormal
    .clone()
    .multiply(Radius)
    .add(hiddenCapCenter);

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
  capPath.setAttribute("id", isTopVisible ? "cylinder-top" : "cylinder-bottom");

  const capFill = applyLighting(
    scene.directionalLight.color,
    cylinder.fill,
    scene.ambientLightColor,
    reversedLightDirection.dotProduct(visibleUpAxisWorldSpace.clone())
  );
  capPath.setAttribute("fill", capFill);

  addStrokeAttribute(capPath, cylinder, cylinderScaleFactor, capFill);
  svg.appendChild(capPath);

  capPath.setAttribute(
    "d",
    `
    M ${visibleLeftPoint.x} ${
      visibleLeftPoint.y
    } A ${Radius} ${ShortRadius} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${
      visibleRightPoint.x
    } ${visibleRightPoint.y}
    A ${Radius} ${ShortRadius} ${xAxisRotation} ${1} ${sweepFlag} ${
      visibleLeftPoint.x
    } ${visibleLeftPoint.y}`
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
    M ${visibleLeftPoint.x} ${visibleLeftPoint.y} 
    A ${Radius} ${ShortRadius} ${xAxisRotation} 0 1 ${visibleRightPoint.x} ${visibleRightPoint.y}
    L ${hiddenRightPoint.x} ${hiddenRightPoint.y}
    A ${Radius} ${ShortRadius} ${xAxisRotation} 0 0 ${hiddenLeftPoint.x} ${hiddenLeftPoint.y}
    Z
    `
  );

  addStrokeAttribute(tubePath, cylinder, cylinderScaleFactor);
  svg.appendChild(tubePath);

  // Convert the light direction into camera space (not projected into screen space)
  const directionalLightInCameraSpace = reversedLightDirection.clone();
  inverseCameraMatrix
    .extractRotation()
    .applyToVector3(directionalLightInCameraSpace);

  const uuid = crypto.randomUUID();
  const fillUuid = uuid + "-fill";
  const fillUrl = `url(#${fillUuid})`;

  tubePath.setAttribute("fill", fillUrl);

  // Create the 'radialGradient' element
  const linearGradient = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "linearGradient"
  );

  linearGradient.setAttribute("id", fillUuid);
  linearGradient.setAttribute("gradientUnits", "userSpaceOnUse");

  // Make the control points of the gradient the center of the cylinder's
  // just to keep it nice and organized when editing in Figma and such later
  const leftOfTubeCenter = visibleLeftPoint
    .clone()
    .add(hiddenLeftPoint)
    .multiply(0.5);
  const rightOfTubeCenter = visibleRightPoint
    .clone()
    .add(hiddenRightPoint)
    .multiply(0.5);

  linearGradient.setAttribute("x1", leftOfTubeCenter.x.toString());
  linearGradient.setAttribute("y1", leftOfTubeCenter.y.toString());
  linearGradient.setAttribute("x2", rightOfTubeCenter.x.toString());
  linearGradient.setAttribute("y2", rightOfTubeCenter.y.toString());

  const leftEdgeNormal = Vector3(0, 0, 1)
    .crossProduct(visibleUpAxisCameraSpace)
    .normalize();

  const lightingSpace = Matrix4x4().lookAt(
    Vector3(0, 0, 0),
    leftEdgeNormal,
    visibleUpAxisCameraSpace
  );

  // Add the gradient stops
  const GradientSteps = Math.max(2, Math.min(255, Math.floor(Radius)));

  for (let i = 0; i < GradientSteps; i++) {
    const normalized = i / (GradientSteps - 1);
    const x = Math.cos(normalized * Math.PI + Math.PI / 2);
    const z = -Math.cos(normalized * Math.PI + Math.PI);
    const normal = Vector3(x, 0, z);

    lightingSpace.applyToVector3(normal);

    const stopElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    stopElement.setAttribute("offset", normalized.toFixed(3));
    stopElement.setAttribute(
      "stop-color",
      applyLighting(
        scene.directionalLight.color,
        cylinder.fill,
        scene.ambientLightColor,
        directionalLightInCameraSpace.dotProduct(normal)
      )
    );
    linearGradient.appendChild(stopElement);
  }

  defs.appendChild(linearGradient);

  // Add Cap last

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

function addStrokeAttribute(
  svgShape: SVGElement,
  cylinderShape: CylinderShape,
  scaleFactor: number,
  fillColor?: string
) {
  if (cylinderShape.strokeWidth && cylinderShape.stroke.a > 0.0) {
    svgShape.setAttribute("stroke", ColorToCSS(cylinderShape.stroke));

    if (cylinderShape.strokeWidth !== 1.0) {
      svgShape.setAttribute(
        "stroke-width",
        (cylinderShape.strokeWidth * scaleFactor).toString()
      );
    }
  } else if (fillColor !== undefined) {
    svgShape.setAttribute("stroke", fillColor);
    svgShape.setAttribute(
      "stroke-width",
      (CrackFillingStrokeWidth * scaleFactor).toString()
    );
  }
}

function normalToXAxisDegrees(x: number, y: number) {
  return (Math.atan2(y, x) / Math.PI) * 180;
}
